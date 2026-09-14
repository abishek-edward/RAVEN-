import { calculateAIAssistedPriorityScore } from '../utils/priorityCalculator.js';

// Individual ground reports grouped under clusters
export const INITIAL_CIVIC_REPORTS = [
  // Clustered under CI-1024: Broken Streetlights & Cable Fault — Perambur
  {
    id: 'CR-101',
    clusterId: 'CI-1024',
    text: 'Streetlight not working along Stephenson Road 1st Cross near the railway colony park.',
    language: 'English',
    location: 'Perambur, Stephenson Road 1st Cross',
    district: 'Chennai',
    category: 'Street Infrastructure',
    subIssue: 'Broken Streetlight',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-01',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-08',
    hasPhoto: true,
    photoUrl: '/ci-1024-street-scene.png',
    attachments: [
      {
        name: 'ci-1024-street-scene.png',
        type: 'image/png',
        size: '360 KB',
        previewUrl: '/ci-1024-street-scene.png'
      }
    ],
    durationDays: 14,
    status: 'Initial Reference'
  },
  {
    id: 'CR-102',
    clusterId: 'CI-1024',
    text: 'Street light broken. Total darkness on Bharathi Nagar corner turn since 2 weeks.',
    language: 'English',
    location: 'Perambur, Bharathi Nagar Corner',
    district: 'Chennai',
    category: 'Street Infrastructure',
    subIssue: 'Broken Streetlight',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-02',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-07',
    hasPhoto: false,
    attachments: [],
    durationDays: 16,
    status: 'Initial Reference'
  },
  {
    id: 'CR-103',
    clusterId: 'CI-1024',
    text: 'வெங்கடேசன் தெருவில் தெருவிளக்கு வேலை செய்யல, பெண்கள் இரவில் செல்ல மிகவும் அச்சமாக உள்ளது.',
    language: 'Tamil',
    location: 'Perambur, Venkatesan Street',
    district: 'Chennai',
    category: 'Street Infrastructure',
    subIssue: 'Broken Streetlight',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-03',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-06',
    hasPhoto: true,
    photoUrl: '/ci-1024-broken-streetlight.png',
    attachments: [
      {
        name: 'ci-1024-broken-streetlight.png',
        type: 'image/png',
        size: '185 KB',
        previewUrl: '/ci-1024-broken-streetlight.png'
      }
    ],
    durationDays: 20,
    status: 'Initial Reference'
  },
  {
    id: 'CR-104',
    clusterId: 'CI-1024',
    text: 'Streetlight has been off for two weeks along Railway Quarters Lane. 5 poles completely dead.',
    language: 'English',
    location: 'Perambur, Railway Quarters Lane',
    district: 'Chennai',
    category: 'Street Infrastructure',
    subIssue: 'Broken Streetlight',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-04',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-05',
    hasPhoto: false,
    attachments: [],
    durationDays: 15,
    status: 'Initial Reference'
  },
  {
    id: 'CR-105',
    clusterId: 'CI-1024',
    text: 'Perambur High Road junction streetlight இரண்டு வாரமா work ஆகல, repair பண்ண ஆள் வரல.',
    language: 'Mixed (Tamil + English)',
    location: 'Perambur, High Road Junction',
    district: 'Chennai',
    category: 'Street Infrastructure',
    subIssue: 'Broken Streetlight',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-05',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-04',
    hasPhoto: false,
    attachments: [],
    durationDays: 18,
    status: 'Initial Reference'
  },

  // Anna Nagar 6th Avenue Potholes Report
  {
    id: 'CR-201',
    clusterId: 'CI-1025',
    text: 'Anna Nagar 6th Avenue-ல இந்த road முழுக்க pothole இருக்கு, rain வந்தா water நிறைய நிற்குது.',
    language: 'Mixed (Tamil + English)',
    location: 'Anna Nagar, 6th Avenue',
    district: 'Chennai',
    category: 'Roads',
    subIssue: 'Deep Potholes / Waterlogging',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-01',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-09',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    attachments: [
      {
        name: 'anna_nagar_pothole_crater.jpg',
        type: 'image/jpeg',
        size: '2.1 MB',
        previewUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
      }
    ],
    durationDays: 28,
    status: 'Initial Reference'
  },

  // Koyambedu Wholesale Market Garbage Report
  {
    id: 'CR-301',
    clusterId: 'CI-1026',
    text: 'Huge vegetable waste and garbage overflowing across pavement near Gate 3 for 10 days, stray cattle scattering trash onto roadway.',
    language: 'English',
    location: 'Koyambedu Wholesale Market, Gate 3 Lane',
    district: 'Chennai',
    category: 'Waste',
    subIssue: 'Overflowing Garbage / Stray Animals',
    reportedBy: 'Anonymous Citizen',
    userId: 'demo-citizen-06',
    isAnonymous: true,
    isSeeded: true,
    date: '2026-03-09',
    hasPhoto: true,
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    attachments: [
      {
        name: 'koyambedu_market_dump.jpg',
        type: 'image/jpeg',
        size: '1.1 MB',
        previewUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80'
      }
    ],
    durationDays: 12,
    status: 'Initial Reference'
  }
];

// Correlated Civic Issue Clusters
export const INITIAL_CIVIC_CLUSTERS = [
  {
    id: 'CI-1024',
    title: 'Broken Streetlights & Cable Fault — Perambur Stephenson Road',
    category: 'Street Infrastructure',
    department: 'Greater Chennai Corporation / Electrical Department & TANGEDCO',
    officialChannelKey: 'streetlights',
    location: 'Perambur, Stephenson Road & Bharathi Nagar',
    district: 'Chennai',
    coordinates: [13.1098, 80.2452],
    reportsCount: 200,
    confirmationsCount: 137,
    evidenceCount: 42,
    affectedLocations: ['Stephenson Road', 'Bharathi Nagar 1st Cross', 'Perambur High Road Junction', 'Railway Quarters Lane', 'Venkatesan Street'],
    severity: 'High',
    durationDays: 21,
    publicSupportScore: 91, // 91/100 citizen upvotes
    aiPriorityData: calculateAIAssistedPriorityScore({
      reportCount: 200,
      severityLevel: 'High',
      durationDays: 21,
      affectedLocationsCount: 5,
      evidenceCount: 42
    }),
    status: 'Ready', // 'Ready', 'Escalation', 'Monitoring', 'Resolved'
    firstReportedDate: '2026-02-18',
    lastReportedDate: '2026-03-10',
    trustLabel: 'ANALYSIS',
    aiSummary: 'Clustered analysis of 200 individual ground submissions reveals pervasive streetlight outages spanning five contiguous cross streets in Perambur Stephenson Road. The outage creates acute night pedestrian safety hazards and has persisted for over 3 weeks despite individual local ward complaints.',
    commonKeywords: ['streetlight', 'darkness', 'Stephenson Road', 'poles without light', 'pedestrian safety', 'தெருவிளக்கு'],
    relevantOfficialChannels: {
      portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
      helpline: '1913 (GCC) / 1912 (TANGEDCO)',
      email: 'commissioner@chennaicorporation.gov.in'
    },
    grievanceStatus: 'Prepared for Official Submission',
    officialResponse: null
  },
  {
    id: 'CI-1026',
    title: 'Garbage Accumulation & Overflowing Bins — Koyambedu Wholesale Market',
    category: 'Waste',
    department: 'Solid Waste Management Department / Greater Chennai Corporation',
    officialChannelKey: 'waste',
    location: 'Koyambedu Wholesale Market Complex & E Road Junction',
    district: 'Chennai',
    coordinates: [13.0694, 80.1948],
    reportsCount: 156,
    confirmationsCount: 110,
    evidenceCount: 31,
    affectedLocations: ['Koyambedu Market E Road', 'Vegetable Mandi Gate 3', 'Flower Market Service Lane'],
    severity: 'High',
    durationDays: 14,
    publicSupportScore: 81,
    aiPriorityData: calculateAIAssistedPriorityScore({
      reportCount: 156,
      severityLevel: 'High',
      durationDays: 14,
      affectedLocationsCount: 3,
      evidenceCount: 31
    }),
    status: 'Escalation',
    firstReportedDate: '2026-02-24',
    lastReportedDate: '2026-03-11',
    trustLabel: 'ANALYSIS',
    aiSummary: 'Cluster indicates severe solid waste build-up blocking public walkway near Koyambedu wholesale market gate and commercial transit junction. Debris is obstructing pedestrian flow and generating sanitation and odor concerns.',
    commonKeywords: ['garbage', 'overflowing bin', 'Koyambedu market', 'dumping', 'sidewalk blocked', 'stray cattle'],
    relevantOfficialChannels: {
      portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
      helpline: '1913',
      email: 'solidwaste@chennaicorporation.gov.in'
    },
    grievanceStatus: 'Manually Submitted by RAVEN Admin',
    officialResponse: 'GCC SWM team dispatched for clearance within 48 hours.'
  },
  {
    id: 'CI-1025',
    title: 'Deep Potholes & Road Subsidence — Anna Nagar 6th Avenue',
    category: 'Roads',
    department: 'Greater Chennai Corporation / Bus Route Roads Department',
    officialChannelKey: 'roads',
    location: 'Anna Nagar, 6th Avenue & 2nd Main Rd Junction',
    district: 'Chennai',
    coordinates: [13.0850, 80.2101],
    reportsCount: 93,
    confirmationsCount: 68,
    evidenceCount: 24,
    affectedLocations: ['6th Avenue Junction', 'Opposite Roundtana Approach', '12th Main Road Crossing'],
    severity: 'Medium',
    durationDays: 28,
    publicSupportScore: 74,
    aiPriorityData: calculateAIAssistedPriorityScore({
      reportCount: 93,
      severityLevel: 'Medium',
      durationDays: 28,
      affectedLocationsCount: 3,
      evidenceCount: 24
    }),
    status: 'Monitoring',
    firstReportedDate: '2026-02-12',
    lastReportedDate: '2026-03-09',
    trustLabel: 'ANALYSIS',
    aiSummary: 'Multiple road surface craters and uneven asphalt subsidence following recent municipal pipe-laying work. Two-wheeler skidding incidents reported during evening traffic hours.',
    commonKeywords: ['pothole', 'road damage', 'skidding', 'pipe laying trench', 'uneven surface', 'Anna Nagar'],
    relevantOfficialChannels: {
      portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
      helpline: '1913',
      email: 'se-roads@chennaicorporation.gov.in'
    },
    grievanceStatus: 'Under Monitoring',
    officialResponse: null
  },
  {
    id: 'CI-1027',
    title: 'Open Storm Water Drain & Overflow Hazard — Velachery Main Road',
    category: 'Drainage',
    department: 'Storm Water Drain Department / Greater Chennai Corporation',
    officialChannelKey: 'drainage',
    location: 'Velachery Main Road near Vijayanagar Bypass',
    district: 'Chennai',
    coordinates: [12.9815, 80.2180],
    reportsCount: 118,
    confirmationsCount: 84,
    evidenceCount: 38,
    affectedLocations: ['Vijayanagar Junction', 'Tansi Nagar Cut Road', 'Dhandeeswaram Corner'],
    severity: 'High',
    durationDays: 19,
    publicSupportScore: 82,
    aiPriorityData: calculateAIAssistedPriorityScore({
      reportCount: 118,
      severityLevel: 'High',
      durationDays: 19,
      affectedLocationsCount: 3,
      evidenceCount: 38
    }),
    status: 'Monitoring',
    firstReportedDate: '2026-02-20',
    lastReportedDate: '2026-03-10',
    trustLabel: 'ANALYSIS',
    aiSummary: 'Uncovered concrete storm water drain slab opening on pedestrian walkway. Foul wastewater stagnation and severe fall hazard during unlit evening hours.',
    commonKeywords: ['storm drain', 'uncovered slab', 'open trench', 'stagnant water', 'mosquito breeding', 'Velachery'],
    relevantOfficialChannels: {
      portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
      helpline: '1913',
      email: 'chiefengineer-swd@chennaicorporation.gov.in'
    },
    grievanceStatus: 'Under Monitoring',
    officialResponse: null
  },
  {
    id: 'CI-1028',
    title: 'Severe Potable Water Pipeline Breach — Usman Road / Ranganathan Street',
    category: 'Water',
    department: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    officialChannelKey: 'water',
    location: 'Usman Road near Ranganathan Street Entrance',
    district: 'Chennai',
    coordinates: [13.0418, 80.2337],
    reportsCount: 62,
    confirmationsCount: 45,
    evidenceCount: 19,
    affectedLocations: ['South Usman Road', 'Ranganathan Street Corner'],
    severity: 'Medium',
    durationDays: 7,
    publicSupportScore: 65,
    aiPriorityData: calculateAIAssistedPriorityScore({
      reportCount: 62,
      severityLevel: 'Medium',
      durationDays: 7,
      affectedLocationsCount: 2,
      evidenceCount: 19
    }),
    status: 'Monitoring',
    firstReportedDate: '2026-03-04',
    lastReportedDate: '2026-03-11',
    trustLabel: 'ANALYSIS',
    aiSummary: 'Pressurized drinking water pipeline valve leak causing continuous flow onto the street and reduced water supply pressure to adjoining commercial and residential complexes.',
    commonKeywords: ['water leak', 'pipe burst', 'drinking water wasting', 'low pressure', 'Usman Road', 'Ranganathan Street'],
    relevantOfficialChannels: {
      portal: 'https://cmwssb.tn.gov.in/complaints',
      helpline: '044-45674567 / 1916',
      email: 'mwssb@tn.nic.in'
    },
    grievanceStatus: 'Under Monitoring',
    officialResponse: null
  }
];
