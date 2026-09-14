export const INITIAL_SCHEMES = [
  {
    id: 'pudhumai-penn',
    name: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme)',
    shortName: 'Pudhumai Penn Scheme',
    department: 'Department of Social Welfare and Women Empowerment, Government of Tamil Nadu',
    location: 'Statewide (Tamil Nadu)',
    category: 'Higher Education & Social Welfare',
    officialStatus: 'Active & Disbursing',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Tamil Nadu e-Governance Agency (TNeGA) Portal',
      url: 'https://tnega.tn.gov.in/',
      reference: 'G.O. (Ms) No. 45, Social Welfare & Women Empowerment Dept.'
    },
    objective: 'To prevent school dropout of female students after Class 12, accelerate higher education gross enrollment ratio, and empower young women financially.',
    benefit: 'Direct financial assistance of ₹1,000 per month credited directly to the student’s Aadhaar-linked bank account until completion of undergraduate degree, diploma, or ITI course.',
    eligibility: 'Female students who completed schooling from Classes 6 to 12 in Tamil Nadu Government schools and are enrolled in recognized higher education institutions.',
    requiredDocuments: [
      'Aadhaar Card of the student',
      'Class 10 and Class 12 Mark Sheets',
      'School Transfer Certificate (TC) confirming study in Govt School (6th to 12th)',
      'Bank Passbook (Account in student’s name linked to Aadhaar)',
      'College Bonafide / Admission ID Card'
    ],
    applicationProcess: 'Students apply through institutional portals via their respective colleges/institutions where designated nodal officers verify academic and school records against the state EMIS repository.',
    timeline: 'Announced in Budget 2022-23; Phase I launched Sept 2022; Phase II expanded Feb 2023.',
    simpleEnglishExplanation: 'The Tamil Nadu government provides ₹1,000 every month directly to female students who studied from classes 6 to 12 in government schools, supporting them throughout their college or diploma degree.',
    simpleTamilExplanation: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து கல்லூரி அல்லது பட்டயப்படிப்பில் சேர்ந்த மாணவிகளுக்கு மாதந்தோறும் ₹1,000 அவர்களின் வங்கிக் கணக்கில் நேரடியாகச் செலுத்தப்படுகிறது.',
    officialChannelKey: 'pudhumai-penn',
  },
  {
    id: 'breakfast-scheme',
    name: "Chief Minister's Breakfast Scheme (முதலமைச்சரின் காலை உணவுத் திட்டம்)",
    shortName: "Chief Minister's Breakfast Scheme",
    department: 'Social Welfare & Nutritious Meal Programme Department / School Education, Government of Tamil Nadu',
    location: 'Statewide Government Primary Schools (Tamil Nadu)',
    category: 'Child Nutrition & School Education',
    officialStatus: 'Active & Expanded Statewide',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Tamil Nadu School Education Department Portal',
      url: 'https://tnschools.gov.in/',
      reference: 'G.O. (Ms) No. 43, Social Welfare & Nutritious Meal Programme'
    },
    objective: 'To eliminate morning hunger among primary school children, boost attendance and daily enrollment, and improve child nutrition and learning capacity.',
    benefit: 'Hot, freshly cooked nutritious breakfast (upma, pongal, kichadi with vegetable sambar) provided free of cost every school morning before classes begin.',
    eligibility: 'All children enrolled in Classes 1 to 5 in recognized Tamil Nadu Government primary schools.',
    requiredDocuments: [
      'Student Enrollment Record with EMIS (Educational Management Information System) ID'
    ],
    applicationProcess: 'Automatic enrollment for all eligible primary students studying in Tamil Nadu Government schools; no separate citizen application required.',
    timeline: 'Pilot launched Sept 2022; expanded to all 31,008 government primary schools across the state in Aug 2023.',
    simpleEnglishExplanation: 'All children in classes 1 to 5 in government primary schools receive a free, hot, nutritious breakfast before classes start every school day.',
    simpleTamilExplanation: 'அரசு தொடக்கப் பள்ளிகளில் 1 முதல் 5-ஆம் வகுப்பு வரை பயிலும் அனைத்து குழந்தைகளுக்கும் பள்ளி நாட்களில் காலையில் சத்தான சூடான உணவு இலவசமாக வழங்கப்படுகிறது.',
    officialChannelKey: 'breakfast-scheme',
  },
  {
    id: 'magalir-urimai',
    name: 'Kalaignar Magalir Urimai Thittam (Basic Income Scheme for Women)',
    shortName: 'Kalaignar Magalir Urimai Thittam',
    department: 'Special Programme Implementation Department, Government of Tamil Nadu',
    location: 'Statewide (Tamil Nadu)',
    category: 'Social Security & Gender Equality',
    officialStatus: 'Active & Disbursing',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Tamil Nadu Public Distribution System (TNPDS) Portal',
      url: 'https://tnpds.gov.in/',
      reference: 'G.O. (Ms) No. 27, Special Programme Implementation Dept.'
    },
    objective: 'To acknowledge the unpaid domestic labor of women heads of households, enhance their financial autonomy, and improve family economic security.',
    benefit: 'Direct financial assistance of ₹1,000 per month deposited into the woman head of household’s bank account on the 15th of every month.',
    eligibility: 'Women heads of families aged 21 years and above with family annual income below ₹2.5 Lakhs, owning less than 5 acres of wetland or 10 acres of dryland, and consuming under 3,600 units of electricity annually.',
    requiredDocuments: [
      'Smart Family Ration Card (NFSA / PHH / NPHS)',
      'Aadhaar Card of the woman applicant',
      'Electricity Consumer Number',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationProcess: 'Applications received through ration shop biometric verification camps and verified by field verification teams against revenue and civil supplies records.',
    timeline: 'Launched on September 15, 2023, currently benefiting over 1.15 crore eligible women heads of families.',
    simpleEnglishExplanation: 'The state provides ₹1,000 every month on the 15th directly into the bank accounts of eligible women heads of families.',
    simpleTamilExplanation: 'தகுதிவாய்ந்த குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 உரிமைத் தொகையாக அவர்களின் வங்கிக் கணக்கில் நேரடியாக வரவு வைக்கப்படுகிறது.',
    officialChannelKey: 'magalir-urimai',
  },
  {
    id: 'thamizh-puthalvan',
    name: 'Thamizh Puthalvan Scheme (தமிழ்ப் புதல்வன் திட்டம்)',
    shortName: 'Thamizh Puthalvan Scheme',
    department: 'Department of Social Welfare and Women Empowerment & Higher Education Dept, Government of Tamil Nadu',
    location: 'Statewide (Tamil Nadu)',
    category: 'Higher Education & Youth Welfare',
    officialStatus: 'Active & Disbursing',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Tamil Nadu e-Governance Agency (TNeGA) Portal',
      url: 'https://tnega.tn.gov.in/',
      reference: 'G.O. (Ms) No. 22, Social Welfare & Women Empowerment Dept.'
    },
    objective: 'To assist male students from government schools in pursuing collegiate education, enabling them to purchase textbooks, study materials, and meet daily boarding expenditures.',
    benefit: 'Monthly direct benefit transfer of ₹1,000 deposited into the student’s bank account until successful completion of undergraduate degree or diploma course.',
    eligibility: 'Male students who studied Classes 6 to 12 in Tamil Nadu Government schools and secured admission into accredited higher educational institutions.',
    requiredDocuments: [
      'Aadhaar Card',
      'School Study Certificate / Transfer Certificate (Classes 6-12 in Govt School)',
      'College Bonafide Certificate / Admission ID',
      'Aadhaar-linked Bank Account Passbook'
    ],
    applicationProcess: 'Institutions register eligible male students via the dedicated state portal; records are authenticated against EMIS database records.',
    timeline: 'Sanctioned in Budget 2024-25; launched statewide in August 2024.',
    simpleEnglishExplanation: 'Male students who completed Classes 6 to 12 in government schools receive ₹1,000 every month into their bank account for the duration of their college education.',
    simpleTamilExplanation: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து கல்லூரி அல்லது பட்டயப்படிப்பில் சேரும் மாணவர்களுக்கு மாதந்தோறும் ₹1,000 கல்வி உதவித்தொகையாக வழங்கப்படுகிறது.',
    officialChannelKey: 'pudhumai-penn',
  },
  {
    id: 'naan-mudhalvan',
    name: 'Naan Mudhalvan Scheme (நான் முதல்வன் - Skill Development & Employability Scheme)',
    shortName: 'Naan Mudhalvan',
    department: 'Tamil Nadu Skill Development Corporation (TNSDC), Government of Tamil Nadu',
    location: 'Statewide (Tamil Nadu)',
    category: 'Skill Development & Employment',
    officialStatus: 'Active Statewide',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Naan Mudhalvan Official State Portal',
      url: 'https://www.naanmudhalvan.tn.gov.in/',
      reference: 'TNSDC / Special Programme Implementation Dept.'
    },
    objective: 'To equip 10 lakh engineering, arts, science, and polytechnic students annually with advanced, industry-certified tech, coding, robotics, and career skills.',
    benefit: 'Free access to industry-curated specialized technical courses (Cloud, AI/ML, Logistics, Banking), certification exams, career mentoring, and corporate placement drives.',
    eligibility: 'Students enrolled in government and government-aided universities, engineering colleges, arts & science colleges, and polytechnics in Tamil Nadu.',
    requiredDocuments: [
      'College Registration / Enrollment Number',
      'Student EMIS / Portal Profile',
      'Aadhaar Card'
    ],
    applicationProcess: 'Seamlessly embedded into collegiate semester syllabus; students access courseware directly using their institutional student portal credentials.',
    timeline: 'Launched on March 1, 2022; continuously operational across all state educational institutions.',
    simpleEnglishExplanation: 'College students in Tamil Nadu receive free industry-grade technical skills training and job placement support integrated directly into their academic degree.',
    simpleTamilExplanation: 'தமிழகக் கல்லூரி மாணவர்களுக்குத் தொழிற்துறை சார்ந்த நவீன தொழில்நுட்பப் பயிற்சிகள் மற்றும் வேலைவாய்ப்பு வழிகாட்டல்கள் இலவசமாக வழங்கப்படுகின்றன.',
    officialChannelKey: 'naan-mudhalvan',
  },
  {
    id: 'makkalai-thedi-maruthuvam',
    name: 'Makkalai Thedi Maruthuvam (மக்களைத் தேடி மருத்துவம் - Doorstep Healthcare Scheme)',
    shortName: 'Makkalai Thedi Maruthuvam',
    department: 'Health and Family Welfare Department / National Health Mission Tamil Nadu',
    location: 'Statewide (Tamil Nadu)',
    category: 'Public Health & Medicine',
    officialStatus: 'Active Statewide',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'National Health Mission Tamil Nadu Portal',
      url: 'https://nhm.tn.gov.in/',
      reference: 'G.O. (Ms) No. 348, Health and Family Welfare Dept.'
    },
    objective: 'To diagnose and manage non-communicable diseases (hypertension and diabetes) at community doorsteps and provide continuous medication to elderly and bedridden patients.',
    benefit: 'Door-to-door diagnostic screening, monthly doorstep drug delivery for hypertension/diabetes, home-based palliative care, and continuous physiotherapy for mobility-impaired patients.',
    eligibility: 'All residents of Tamil Nadu, prioritized for individuals aged 45 years and above, bedridden patients, and chronic non-communicable disease patients.',
    requiredDocuments: [
      'Aadhaar Card or Family Smart Card (for health worker registration)'
    ],
    applicationProcess: 'Women Health Volunteers (WHVs) and Village Health Nurses visit habitations and homes directly; no complex paperwork or visit to health facilities required.',
    timeline: 'Launched in August 2021; over 1.05 crore beneficiaries served across all 38 districts.',
    simpleEnglishExplanation: 'Government health workers visit homes to test for high blood pressure and diabetes, delivering needed monthly medicines directly to patients for free.',
    simpleTamilExplanation: 'தொற்றா நோய்களுக்கான பரிசோதனைகள் மற்றும் தேவையான மாத்திரைகள் முதியவர்கள் மற்றும் நோயாளிகளின் இல்லத்திற்கே நேரடியாகச் சென்று இலவசமாக வழங்கப்படுகின்றன.',
    officialChannelKey: 'cmchis',
  },
  {
    id: 'cmchis',
    name: "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS - முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம்)",
    shortName: 'CMCHIS Health Insurance',
    department: 'Health and Family Welfare Department, Government of Tamil Nadu',
    location: 'Statewide (Tamil Nadu)',
    category: 'Healthcare & Insurance',
    officialStatus: 'Active & Operational',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Official CMCHIS Portal (cmchistn.com)',
      url: 'https://cmchistn.com/',
      reference: 'G.O. (Ms) No. 169, Health & Family Welfare Dept.'
    },
    objective: 'To provide comprehensive cashless tertiary and secondary hospitalization care to low-income families in empaneled government and private hospitals.',
    benefit: 'Cashless hospital treatment and specialized surgeries covering up to ₹5,00,000 per family per year across 1,513 medical and surgical procedures.',
    eligibility: 'Resident families of Tamil Nadu whose annual income is less than ₹1,20,000 and who possess an active Smart Family Ration Card.',
    requiredDocuments: [
      'Smart Family Ration Card',
      'Income Certificate issued by Revenue Authority / VAO',
      'Aadhaar Cards of family members',
      'Passport size photographs'
    ],
    applicationProcess: 'Applicants register at designated CMCHIS enrollment kiosks located at District Collectorates and Taluk Offices with biometric verification.',
    timeline: 'Coverage restructured and enhanced to ₹5 Lakhs per family annually in 2022.',
    simpleEnglishExplanation: 'Eligible families in Tamil Nadu receive free cashless hospital treatment and surgeries up to ₹5 Lakhs per year at empaneled government and private hospitals.',
    simpleTamilExplanation: 'குறைந்த வருமானம் கொண்ட குடும்பங்களுக்கு அரசு மற்றும் தனியார் மருத்துவமனைகளில் ஆண்டிற்கு ₹5 லட்சம் வரை கட்டணமில்லா அறுவை சிகிச்சை மற்றும் மருத்துவ சிகிச்சை வழங்கப்படுகிறது.',
    officialChannelKey: 'cmchis',
  },
  {
    id: 'illam-thedi-kalvi',
    name: 'Illam Thedi Kalvi (இல்லம் தேடிக் கல்வி - Remedial Education at Doorsteps)',
    shortName: 'Illam Thedi Kalvi',
    department: 'Department of School Education, Government of Tamil Nadu',
    location: 'Statewide (Villages & Habitations, Tamil Nadu)',
    category: 'Primary & Middle Education',
    officialStatus: 'Active & Operational',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Official Illam Thedi Kalvi State Portal',
      url: 'https://illamthedikalvi.tnschools.gov.in/',
      reference: 'G.O. (Ms) No. 175, School Education Department'
    },
    objective: 'To bridge academic learning gaps among primary and upper primary students through community-based volunteer-guided remedial learning after regular school hours.',
    benefit: 'Free 1 to 1.5 hours of daily evening academic learning sessions, activity-based reading modules, foundational numeracy worksheets, and educational games conducted by trained local volunteers.',
    eligibility: 'Children studying in Classes 1 to 8 in Tamil Nadu government and local body schools.',
    requiredDocuments: [
      'Student School Registration / EMIS ID'
    ],
    applicationProcess: 'Automatic neighborhood enrollment; local school headmasters map students to the nearest community learning center run by verified educational volunteers.',
    timeline: 'Launched in October 2021; actively functioning across more than 1.8 lakh learning centers statewide.',
    simpleEnglishExplanation: 'Government school students from classes 1 to 8 receive free evening tutoring and fun learning activities in their neighborhood after school hours.',
    simpleTamilExplanation: '1 முதல் 8-ஆம் வகுப்பு வரை படிக்கும் அரசுப் பள்ளி மாணவர்களின் கற்றல் இடைவெளியைக் குறைக்க அவர்களின் குடியிருப்புப் பகுதியிலேயே மாலை நேரக் கல்வி வகுப்புகள் இலவசமாக நடத்தப்படுகின்றன.',
    officialChannelKey: 'illam-thedi-kalvi',
  },
  {
    id: 'vidiyal-payanam',
    name: 'Vidiyal Payanam Scheme (Zero-Fare Bus Travel for Women - விடியல் பயணம் திட்டம்)',
    shortName: 'Vidiyal Payanam Scheme',
    department: 'Transport Department, Government of Tamil Nadu',
    location: 'Statewide (Ordinary State Transport Buses, Tamil Nadu)',
    category: 'Public Transportation & Social Welfare',
    officialStatus: 'Active Statewide',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'State Transport Authority (STA) Tamil Nadu Portal',
      url: 'https://tnsta.gov.in/',
      reference: 'G.O. (Ms) No. 49, Transport Department'
    },
    objective: 'To promote economic participation, mobility, and financial savings for women, transgender persons, and persons with disabilities across urban and rural bus routes.',
    benefit: 'Completely free travel in ordinary-fare town and city buses operated by State Transport Undertakings (MTC, TNSTC), saving households between ₹800–₹1,200 monthly.',
    eligibility: 'All women residents of Tamil Nadu, female students, transgender individuals, and persons with benchmark disabilities along with an attendant.',
    requiredDocuments: [
      'No application or advance pass required; zero-fare paper tickets issued on board upon travel'
    ],
    applicationProcess: 'Universal open access; passengers board any designated ordinary town bus displaying pink destination signage boards.',
    timeline: 'Implemented on May 8, 2021; has surpassed over 500 crore passenger trips across Tamil Nadu.',
    simpleEnglishExplanation: 'Women and transgender individuals can travel completely free of charge on all ordinary government city and town buses across Tamil Nadu.',
    simpleTamilExplanation: 'தமிழகம் முழுவதும் உள்ள அரசு சாதாரண கட்டண நகரப் பேருந்துகளில் பெண்கள் மற்றும் திருநங்கைகள் கட்டணமின்றி இலவசமாகப் பயணம் செய்யலாம்.',
    officialChannelKey: 'roads',
  },
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN - பிரதம மந்திரி கிசான் சம்மான் நிதி)',
    shortName: 'PM-KISAN Scheme',
    department: 'Department of Agriculture & Farmers Welfare, Government of India & Tamil Nadu',
    location: 'Statewide (Agricultural Districts, Tamil Nadu & India)',
    category: 'Agriculture & Farmer Welfare',
    officialStatus: 'Active & Disbursing',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'PM-KISAN Official Central Government Portal',
      url: 'https://pmkisan.gov.in/',
      reference: 'Ministry of Agriculture and Farmers Welfare, New Delhi'
    },
    objective: 'To provide supplementary income support to landholding farmers’ families to purchase agricultural inputs like seeds, fertilizers, and equipment for seasonal farming.',
    benefit: 'Direct financial assistance of ₹6,000 per year credited in three equal four-monthly installments of ₹2,000 each directly to Aadhaar-linked bank accounts.',
    eligibility: 'All farmer families holding cultivable agricultural land registered in their names (subject to specified institutional exclusions).',
    requiredDocuments: [
      'Aadhaar Card of the farmer',
      'Land Ownership Document (Patta / Chitta copy)',
      'Aadhaar-seeded Active Bank Account Passbook'
    ],
    applicationProcess: 'Online self-registration via pmkisan.gov.in portal, local Village Agricultural Extension Offices, or through common e-Seva centers with biometric e-KYC.',
    timeline: 'Operational since December 2018; 18th installment disbursed nationwide in 2024.',
    simpleEnglishExplanation: 'Eligible farmer families receive ₹6,000 per year directly in their bank account in three equal payments of ₹2,000 to assist with farming costs.',
    simpleTamilExplanation: 'நிலம் வைத்துள்ள தகுதியான விவசாயக் குடும்பங்களுக்கு விவசாயச் செலவுகளுக்காக ஆண்டிற்கு ₹6,000 மூன்று தவணைகளாக தலா ₹2,000 வீதம் நேரடியாக வங்கிக் கணக்கில் வழங்கப்படுகிறது.',
    officialChannelKey: 'pm-kisan',
  },
  {
    id: 'kalaignar-kanavu-illam',
    name: 'Kalaignar Kanavu Illam Scheme (Rural Concrete Housing Scheme - கலைஞர் கனவு இல்லம் திட்டம்)',
    shortName: 'Kalaignar Kanavu Illam',
    department: 'Rural Development and Panchayat Raj Department, Government of Tamil Nadu',
    location: 'Statewide (Rural Habitations, Tamil Nadu)',
    category: 'Rural Housing & Infrastructure',
    officialStatus: 'Active & Under Construction',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Rural Development & Panchayat Raj Department Portal',
      url: 'https://tnrd.tn.gov.in/',
      reference: 'G.O. (Ms) No. 41, Rural Development and Panchayat Raj Dept.'
    },
    objective: 'To eliminate dilapidated thatched huts across rural Tamil Nadu and provide resilient, climate-safe concrete pucca homes for poor families by 2030.',
    benefit: 'Unit grant of ₹3,50,000 per house disbursed in transparent, geo-tagged milestone stages for constructing a 360 sq.ft pucca RCC roofed house.',
    eligibility: 'Rural families residing in thatched huts or kutcha structures who own patta land or house sites and have not availed previous government housing grants.',
    requiredDocuments: [
      'House Site Patta in applicant’s or spouse’s name',
      'Smart Family Ration Card',
      'Aadhaar Card',
      'Bank Account Passbook (Aadhaar linked)',
      'Photograph of existing hut verified by Village Panchayat'
    ],
    applicationProcess: 'Identification through comprehensive rural hut survey conducted by Village Panchayat Ward Committees and authenticated by Block Development Officers (BDO).',
    timeline: 'Announced in Budget 2024; Phase I targeting 1 lakh houses currently under active ground construction.',
    simpleEnglishExplanation: 'Poor rural families living in thatched huts receive ₹3.5 Lakhs from the government in installments to build a secure concrete home.',
    simpleTamilExplanation: 'கிராமப்புறங்களில் குடிசைகளில் வாழும் ஏழை எளிய குடும்பங்கள் கான்கிரீட் வீடுகள் கட்டிக்கொள்ள ₹3,50,000 நிதி உதவி வழங்கப்படுகிறது.',
    officialChannelKey: 'rural-housing',
  },
  {
    id: 'mgnrega-tn',
    name: 'Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGA Tamil Nadu)',
    shortName: 'MGNREGA Rural Employment',
    department: 'Rural Development and Panchayat Raj Department, Government of Tamil Nadu & GoI',
    location: 'Statewide (Rural Gram Panchayats, Tamil Nadu)',
    category: 'Rural Employment & Livelihoods',
    officialStatus: 'Active Statewide',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'MGNREGA Official Portal (Ministry of Rural Development)',
      url: 'https://nrega.nic.in/',
      reference: 'National Rural Employment Guarantee Act & TN Rural Development Orders'
    },
    objective: 'To enhance livelihood security in rural areas by guaranteeing at least 100 days of wage employment in a financial year to rural households willing to do manual work.',
    benefit: 'Guaranteed 100 days of wage employment per household with daily statutory wages credited directly into workers’ Aadhaar-seeded bank/post office accounts.',
    eligibility: 'Adult members of rural households who apply for work and are willing to undertake unskilled manual labor.',
    requiredDocuments: [
      'MGNREGA Job Card issued by Gram Panchayat',
      'Aadhaar Card linked to Job Card',
      'Bank / Post Office Account Passbook'
    ],
    applicationProcess: 'Apply for a Job Card at the local Village Panchayat Office; work demand slips submitted to the Panchayat Secretary.',
    timeline: 'Ongoing national statutory scheme operating continuously across all Village Panchayats in Tamil Nadu.',
    simpleEnglishExplanation: 'Rural households are guaranteed 100 days of wage work each year on water conservation and village development projects with direct bank payments.',
    simpleTamilExplanation: 'கிராமப்புறங்களில் உள்ள தொழிலாளர்களுக்கு ஆண்டிற்கு 100 நாட்கள் வேலைவாய்ப்பும், அதற்கான ஊதியமும் நேரடியாக வங்கிக் கணக்கில் வழங்கப்படுகிறது.',
    officialChannelKey: 'rural-housing',
  },
  {
    id: 'swachh-bharat-tn',
    name: 'Swachh Bharat Mission (Grameen / Urban Sanitation & Waste Management)',
    shortName: 'Swachh Bharat Sanitation',
    department: 'Municipal Administration & Rural Development, Govt of Tamil Nadu & Ministry of Jal Shakti',
    location: 'Statewide (Urban Local Bodies & Rural Panchayats, Tamil Nadu)',
    category: 'Sanitation & Waste Management',
    officialStatus: 'Active Statewide',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Swachh Bharat Mission Official Government Portal',
      url: 'https://swachhbharatmission.ddws.gov.in/',
      reference: 'Guidelines on Solid & Liquid Waste Management, Dept of Drinking Water & Sanitation'
    },
    objective: 'To achieve universal sanitation coverage, maintain Open Defecation Free (ODF) Plus status, and implement scientific solid and liquid waste management.',
    benefit: 'Financial subsidy for individual household latrine construction (₹12,000), decentralized community waste collection centers, and micro-composting units in local wards.',
    eligibility: 'Households in rural and peri-urban habitations lacking sanitary toilets, and local communities requiring scientific solid waste processing infrastructure.',
    requiredDocuments: [
      'Aadhaar Card',
      'Bank Account Passbook copy',
      'Proof of Residence / Smart Ration Card'
    ],
    applicationProcess: 'Apply online through the Swachh Bharat portal or submit verification form to the Village Panchayat Secretary / Municipal Health Officer.',
    timeline: 'Phase II active across Tamil Nadu focusing on sustainable solid-liquid waste segregation and gray-water management.',
    simpleEnglishExplanation: 'Government provides ₹12,000 financial support to build home toilets and funds local neighborhood door-to-door garbage segregation and composting.',
    simpleTamilExplanation: 'வீட்டு கழிவறைகள் கட்ட ₹12,000 மானியமும், ஊராட்சிகளில் கழிவு மேலாண்மை மற்றும் தூய்மைப் பணிகளுக்கான திட்டங்களும் செயல்படுத்தப்படுகின்றன.',
    officialChannelKey: 'waste',
  },
  {
    id: 'eservices-patta',
    name: 'Tamil Nadu Land Records & Online Patta Chitta Scheme (நில உரிமை மற்றும் பட்டா சிட்டா சேவை)',
    shortName: 'Online Patta Chitta e-Services',
    department: 'Revenue and Disaster Management Department / Commissionerate of Land Administration, Government of Tamil Nadu',
    location: 'Statewide (All Taluks & Revenue Villages, Tamil Nadu)',
    category: 'Land Administration & Civic Services',
    officialStatus: 'Active & Operational',
    trustLabel: 'OFFICIAL', // 🟢 Officially Verified
    isDemoRecord: false,
    officialSource: {
      name: 'Commissionerate of Land Administration e-Services Portal',
      url: 'https://eservices.tn.gov.in/',
      reference: 'Tamil Nadu Land Records Modernization & Revenue Administration Orders'
    },
    objective: 'To ensure transparent, digital verification of land ownership, prevent unauthorized land transactions, and enable citizens to download digitally signed Patta and Chitta documents instantly.',
    benefit: 'Instant online viewing and downloading of digitally signed Patta/Chitta extracts, A-Register extracts, and online tracking of Patta transfer applications without visiting Taluk offices.',
    eligibility: 'All property and agricultural land owners across rural and urban revenue divisions in Tamil Nadu.',
    requiredDocuments: [
      'District, Taluk, and Village details',
      'Survey Number and Sub-Division Number (or Patta Number)',
      'Registered Sale Deed / Title Deed (for mutation applications)'
    ],
    applicationProcess: 'Public access through eservices.tn.gov.in; enter district, taluk, village, and survey number to retrieve authenticated digital land records 24x7.',
    timeline: 'Fully digitized statewide covering over 2 crore rural and urban survey sub-divisions.',
    simpleEnglishExplanation: 'Citizens can view, verify, and download official government land ownership records (Patta and Chitta) online at any time without visiting government offices.',
    simpleTamilExplanation: 'பொதுமக்கள் அரசு அலுவலகங்களுக்குச் செல்லாமல் இணையவழியில் தங்களின் நில உரிமைக்கான பட்டா, சிட்டா மற்றும் நில ஆவணங்களை உடனடியாகப் பதிவிறக்கம் செய்து கொள்ளலாம்.',
    officialChannelKey: 'roads',
  }
];
