/**
 * Server-side Fast Trigger Authority Resolver
 * Identifies government authority, sector, ward/constituency, and channel packet
 */

const OFFICIAL_CHANNELS_SERVER = {
  'streetlights': {
    department: 'Greater Chennai Corporation / Electrical Department & TANGEDCO',
    helpline: '1913 (GCC) / 1912 (TANGEDCO)',
    portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
    email: 'commissioner@chennaicorporation.gov.in',
    hours: '24x7 Citizen Emergency Cell'
  },
  'roads': {
    department: 'Greater Chennai Corporation / Bus Route Roads Department',
    helpline: '1913 (GCC Public Grievance)',
    portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
    email: 'se-roads@chennaicorporation.gov.in',
    hours: '24x7 GCC Grievance Center'
  },
  'waste': {
    department: 'Solid Waste Management Department / Greater Chennai Corporation',
    helpline: '1913 (GCC Cleanliness Line)',
    portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
    email: 'solidwaste@chennaicorporation.gov.in',
    hours: '6:00 AM to 10:00 PM Daily'
  },
  'water': {
    department: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    helpline: '044-45674567 / 1916 (CMWSSB Grievance Cell)',
    portal: 'https://cmwssb.tn.gov.in/complaints',
    email: 'mwssb@tn.nic.in',
    hours: '24x7 Central Complaints Cell'
  },
  'drainage': {
    department: 'Storm Water Drain Department / Greater Chennai Corporation',
    helpline: '1913 (GCC Flood & Drain Control Room)',
    portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
    email: 'chiefengineer-swd@chennaicorporation.gov.in',
    hours: '24x7 Monsoon & Drain Control'
  }
};

// Sample jurisdiction centers for demo localities only — not authoritative statewide GIS boundaries.
export const LOCALITY_WARD_MAP = [
  {
    keywords: ['perambur', 'stephenson', 'bharathi nagar', 'venkatesan'],
    ward: 'GCC Ward 70 / Zone 6 (Thiru-Vi-Ka Nagar)',
    constituency: 'Thiru-Vi-Ka Nagar Assembly',
    centerLat: 13.1098,
    centerLng: 80.2452,
    radiusKm: 3.5
  },
  {
    keywords: ['anna nagar', 'roundtana', '6th avenue', '12th main'],
    ward: 'GCC Ward 104 / Zone 8 (Anna Nagar)',
    constituency: 'Anna Nagar Assembly',
    centerLat: 13.0850,
    centerLng: 80.2101,
    radiusKm: 3.0
  },
  {
    keywords: ['koyambedu', 'mandi', 'market'],
    ward: 'GCC Ward 127 / Zone 10 (Kodambakkam)',
    constituency: 'Maduravoyal Assembly',
    centerLat: 13.0694,
    centerLng: 80.1948,
    radiusKm: 2.5
  },
  {
    keywords: ['velachery', 'vijayanagar', 'tansi nagar', 'dhandeeswaram'],
    ward: 'GCC Ward 172 / Zone 13 (Adyar)',
    constituency: 'Velachery Assembly',
    centerLat: 12.9815,
    centerLng: 80.2180,
    radiusKm: 3.0
  },
  {
    keywords: ['usman road', 'ranganathan', 't. nagar', 'tnagar'],
    ward: 'GCC Ward 117 / Zone 9 (T. Nagar)',
    constituency: 'T. Nagar Assembly',
    centerLat: 13.0418,
    centerLng: 80.2337,
    radiusKm: 2.5
  },
  {
    keywords: ['tambaram', 'chromepet', 'sanatorium'],
    ward: 'Tambaram Municipal Corporation — Zone 2',
    constituency: 'Tambaram Assembly',
    centerLat: 12.9249,
    centerLng: 80.1000,
    radiusKm: 4.5
  },
  {
    keywords: ['adyar', 'besant nagar', 'thiruvanmiyur'],
    ward: 'GCC Ward 175 / Zone 13 (Adyar)',
    constituency: 'Velachery / Mylapore Assembly',
    centerLat: 13.0012,
    centerLng: 80.2565,
    radiusKm: 3.0
  },
  {
    keywords: ['mylapore', 'royapettah', 'triplicane'],
    ward: 'GCC Ward 119 / Zone 9 (Mylapore)',
    constituency: 'Mylapore Assembly',
    centerLat: 13.0368,
    centerLng: 80.2676,
    radiusKm: 2.5
  }
];

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Real GPS -> Jurisdiction Resolution
 * Flow:
 * 1. Validate lat/lng and compute Haversine distance to demo locality centers.
 *    If within radiusKm, return nearest match.
 * 2. If no coordinate match, fall back to existing keyword matching logic.
 * 3. If neither method matches, return explicit { ward: "Unassigned", constituency: "Unassigned" }.
 * Note: Never infers or synthesizes ward from district name.
 */
export function resolveJurisdictionByCoordinates(lat, lng, localityText = '') {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const hasValidCoords = 
    !isNaN(parsedLat) && 
    !isNaN(parsedLng) && 
    parsedLat >= -90 && parsedLat <= 90 && 
    parsedLng >= -180 && parsedLng <= 180;

  if (hasValidCoords) {
    let nearestMatch = null;
    let minDistance = Infinity;

    for (const item of LOCALITY_WARD_MAP) {
      if (item.centerLat != null && item.centerLng != null) {
        const dist = haversineDistanceKm(parsedLat, parsedLng, item.centerLat, item.centerLng);
        if (dist <= item.radiusKm && dist < minDistance) {
          minDistance = dist;
          nearestMatch = item;
        }
      }
    }

    if (nearestMatch) {
      return {
        ward: nearestMatch.ward,
        constituency: nearestMatch.constituency,
        matchType: 'COORDINATE',
        distanceKm: Math.round(minDistance * 100) / 100
      };
    }
  }

  // Keyword fallback
  if (localityText && typeof localityText === 'string') {
    const locLower = localityText.toLowerCase();
    const matchedWard = LOCALITY_WARD_MAP.find(m => m.keywords.some(k => locLower.includes(k)));
    if (matchedWard) {
      return {
        ward: matchedWard.ward,
        constituency: matchedWard.constituency,
        matchType: 'KEYWORD_FALLBACK'
      };
    }
  }

  // Explicit unassigned fallback
  return {
    ward: 'Unassigned',
    constituency: 'Unassigned',
    matchType: 'UNASSIGNED'
  };
}

export function resolveFastTriggerAuthorityServer({ category = '', location = '', district = 'Chennai', cluster = null }) {
  const locLower = (location || '').toLowerCase();
  const catLower = (category || '').toLowerCase();

  const matchedWard = LOCALITY_WARD_MAP.find(m => m.keywords.some(k => locLower.includes(k)));
  const ward = matchedWard ? matchedWard.ward : `${district} Administrative Ward / Local Zone`;
  const constituency = matchedWard ? matchedWard.constituency : `${district} Assembly Constituency`;

  let channelKey = 'roads';
  let sector = 'Municipal Roads & Infrastructure Maintenance';

  if (catLower.includes('light') || catLower.includes('street infrastructure')) {
    channelKey = 'streetlights';
    sector = 'Street Lighting & Municipal Electrical Infrastructure';
  } else if (catLower.includes('waste') || catLower.includes('garbage')) {
    channelKey = 'waste';
    sector = 'Solid Waste Management & Public Sanitation';
  } else if (catLower.includes('drain')) {
    channelKey = 'drainage';
    sector = 'Storm Water Drains & Monsoon Flood Mitigation';
  } else if (catLower.includes('water')) {
    channelKey = 'water';
    sector = 'Potable Water Distribution & Sewage Infrastructure';
  } else if (catLower.includes('road') || catLower.includes('pothole')) {
    channelKey = 'roads';
    sector = 'Bus Route Roads & Pothole Repair Division';
  }

  const channelDetails = OFFICIAL_CHANNELS_SERVER[channelKey] || OFFICIAL_CHANNELS_SERVER['roads'];

  const reportsCount = cluster?.reportsCount || 1;
  const confirmationsCount = cluster?.confirmationsCount || 1;
  const evidenceCount = cluster?.evidenceCount || 0;
  const durationDays = cluster?.durationDays || 7;
  const priorityScore = cluster?.aiPriorityData?.score || 50;

  return {
    issueCategory: category || 'Civic Infrastructure',
    location: location || `${district} Local Area`,
    district,
    ward,
    constituency,
    sector,
    department: channelDetails.department,
    officialChannel: {
      key: channelKey,
      portal: channelDetails.portal,
      helpline: channelDetails.helpline,
      email: channelDetails.email,
      hours: channelDetails.hours
    },
    factualMetrics: {
      reportsCount,
      confirmationsCount,
      evidenceCount,
      durationDays,
      priorityScore,
      priorityFactors: {
        volumeWeight: '30%',
        severityWeight: '25%',
        durationWeight: '20%',
        spreadWeight: '15%',
        evidenceWeight: '10%'
      }
    },
    officialResponseStatus: cluster?.officialResponse 
      ? { exists: true, text: cluster.officialResponse } 
      : { exists: false, text: 'No official government response received.' }
  };
}
