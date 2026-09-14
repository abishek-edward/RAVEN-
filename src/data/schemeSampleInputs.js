// Scheme-specific suggested categories and realistic citizen sample inputs per scheme

export const SCHEME_CATEGORIES = {
  'pudhumai-penn': [
    'Payment not received',
    'Application pending',
    'Aadhaar / bank issue',
    'Eligibility issue',
    'College verification issue',
    'Other implementation issue'
  ],
  'breakfast-scheme': [
    'Breakfast not provided',
    'Late serving',
    'Poor food quality',
    'Insufficient quantity',
    'School not following schedule',
    'Other implementation issue'
  ],
  'magalir-urimai': [
    'Payment not received',
    'Application rejected',
    'Eligibility dispute',
    'Bank account issue',
    'Verification delay',
    'Other implementation issue'
  ],
  'thamizh-puthalvan': [
    'College verification issue',
    'Payment not received',
    'EMIS school record mismatch',
    'Aadhaar / bank issue',
    'Application pending',
    'Other implementation issue'
  ],
  'naan-mudhalvan': [
    'Course access / portal issue',
    'Certificate generation delay',
    'Trainer scheduling gap',
    'Course material missing',
    'Placement drive notification issue',
    'Other implementation issue'
  ],
  'cmchis': [
    'Cashless denial at hospital',
    'Pre-authorization delay',
    'Billing for covered consumables',
    'Smart card recognition issue',
    'Hospital empanelment dispute',
    'Other implementation issue'
  ],
  'makkalai-thedi-maruthuvam': [
    'Monthly medicine refill delay',
    'Irregular field volunteer visits',
    'BP apparatus calibration gap',
    'Physiotherapy session pending',
    'Diagnostic test not conducted',
    'Other implementation issue'
  ],
  'illam-thedi-kalvi': [
    'Volunteer turnover',
    'Learning material shortage',
    'Evening lighting issue in center',
    'Class timing inconvenience',
    'Center location change',
    'Other implementation issue'
  ],
  'vidiyal-payanam': [
    'Dispute over bus type classification',
    'Inadequate frequency of ordinary buses',
    'Boarding denial by crew',
    'Overcrowding during peak hours',
    'Zero-fare ticket refusal',
    'Other implementation issue'
  ],
  'pm-kisan': [
    'Land record seeding pendency',
    'e-KYC biometric mismatch',
    'Installment crediting delay',
    'Beneficiary status inactive',
    'Bank NPCI mapping failure',
    'Other implementation issue'
  ],
  'kalaignar-kanavu-illam': [
    'Milestone inspection delay',
    'Stage fund disbursement delay',
    'Survey inclusion dispute',
    'Material supply bottleneck',
    'Patta verification hold',
    'Other implementation issue'
  ],
  'mgnrega-tn': [
    'Wage payment delay beyond 15 days',
    'Work demand allocation delay',
    'NMMS mobile attendance glitch',
    'Job card renewal issue',
    'Measurement sheet entry delay',
    'Other implementation issue'
  ],
  'swachh-bharat-tn': [
    'Micro-composting center overflow',
    'Door-to-door collection irregularity',
    'Community toilet maintenance gap',
    'Sanitation worker shortage',
    'Drainage segregation fault',
    'Other implementation issue'
  ],
  'eservices-patta': [
    'Online Patta transfer pendency',
    'Survey sub-division error in FMB',
    'e-Seva portal server timeout',
    'A-Register name discrepancy',
    'Field inspection by surveyor pending',
    'Other implementation issue'
  ]
};

export const SCHEME_SAMPLE_INPUTS = {
  'pudhumai-penn': [
    {
      text: 'Pudhumai Penn oda payment இன்னும் வரல.',
      language: 'Mixed (Tamil + English)',
      category: 'Payment not received',
      delayDays: 75
    },
    {
      text: 'எனக்கு கடந்த 3 மாதமாக புதுமை பெண் தொகை வரவில்லை.',
      language: 'Tamil',
      category: 'Payment not received',
      delayDays: 90
    },
    {
      text: 'Applied in Nov 2025, still showing college nodal verification pending.',
      language: 'English',
      category: 'College verification issue',
      delayDays: 60
    },
    {
      text: 'Bank-la Aadhaar seed panniten, aana portal-la mismatch kaatudhu.',
      language: 'Mixed (Tamil + English)',
      category: 'Aadhaar / bank issue',
      delayDays: 45
    },
    {
      text: 'College changed, need to transfer my Pudhumai Penn registration.',
      language: 'English',
      category: 'College verification issue',
      delayDays: 30
    }
  ],
  'thamizh-puthalvan': [
    {
      text: 'Thamizh Puthalvan scheme application was approved by college, but January and February stipend not credited.',
      language: 'English',
      category: 'Payment not received',
      delayDays: 60
    },
    {
      text: 'கல்லூரியில் விண்ணப்பித்து 2 மாதங்கள் ஆகியும் போர்ட்டலில் ஒப்புதல் வரவில்லை.',
      language: 'Tamil',
      category: 'College verification issue',
      delayDays: 65
    }
  ],
  'naan-mudhalvan': [
    {
      text: 'Completed 100% of the Cloud Computing course on Naan Mudhalvan portal, but completion badge and certificate not generated for placement drive.',
      language: 'English',
      category: 'Certificate generation delay',
      delayDays: 25
    },
    {
      text: 'நான் முதல்வன் போர்ட்டலில் லாகின் செய்யும்போது எரர் வருகிறது.',
      language: 'Tamil',
      category: 'Course access / portal issue',
      delayDays: 14
    }
  ],
  'breakfast-scheme': [
    {
      text: 'Breakfast not provided at our primary school today, cook was absent.',
      language: 'English',
      category: 'Breakfast not provided',
      delayDays: 1
    },
    {
      text: 'உணவு 9:15 மணிக்கு தாமதமாக வழங்கப்படுகிறது, வகுப்புகள் தொடங்கிய பிறகு குழந்தைகள் சாப்பிடுகிறார்கள்.',
      language: 'Tamil',
      category: 'Late serving',
      delayDays: 14
    }
  ],
  'magalir-urimai': [
    {
      text: 'Magalir Urimai amount last 2 months credit aagala. Bank account active-ah irukku.',
      language: 'Mixed (Tamil + English)',
      category: 'Payment not received',
      delayDays: 60
    },
    {
      text: 'மறு மேல்முறையீடு செய்து 45 நாட்கள் ஆகியும் இன்னும் எந்த பதிலும் வரவில்லை.',
      language: 'Tamil',
      category: 'Verification delay',
      delayDays: 45
    }
  ],
  'cmchis': [
    {
      text: 'Private hospital in Madurai claimed surgery is not covered under CMCHIS and charged ₹35,000 in cash despite showing active smart card.',
      language: 'English',
      category: 'Cashless denial at hospital',
      delayDays: 10
    },
    {
      text: 'மருத்துவமனையில் முன் அனுமதி (pre-authorization) பெற 2 நாட்களுக்கு மேல் தாமதம் ஆகிறது.',
      language: 'Tamil',
      category: 'Pre-authorization delay',
      delayDays: 7
    }
  ],
  'pm-kisan': [
    {
      text: '18th installment of PM-KISAN not credited due to land patta mismatch with village revenue records.',
      language: 'English',
      category: 'Land record seeding pendency',
      delayDays: 45
    },
    {
      text: 'இ-கேஒய்சி (e-KYC) முடித்தும் தவணைத் தொகை இன்னும் வரவு வைக்கப்படவில்லை.',
      language: 'Tamil',
      category: 'e-KYC biometric mismatch',
      delayDays: 30
    }
  ]
};
