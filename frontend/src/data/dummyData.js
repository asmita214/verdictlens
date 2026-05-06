// ─── VerdictLens Dummy Data ──────────────────────────────────────────────────

export const stats = {
  totalJudgments: '47,382',
  judgesProfiled: '1,284',
  districtsCovered: '412',
  nationalAvgSentence: '3.8 yrs',
};

export const anomalousJudges = [
  {
    id: 'j001',
    name: 'Justice R.K. Sharma',
    court: 'Delhi District Court',
    district: 'Central Delhi',
    score: 81,
    pattern: 'Consistently sentences robbery offenses 2.4× above district median.',
  },
  {
    id: 'j002',
    name: 'Justice Meena Agarwal',
    court: 'Lucknow Civil Court',
    district: 'Lucknow',
    score: 76,
    pattern: 'Bail denial rate for IPC §376 cases is 94% vs. 61% district avg.',
  },
  {
    id: 'j003',
    name: 'Justice P.S. Nair',
    court: 'Chennai Sessions Court',
    district: 'Chennai Central',
    score: 72,
    pattern: 'Fraud sentencing 1.9× national average; high repeat-offender leniency.',
  },
];

export const recentJudgments = [
  {
    id: 'CAS/2024/DEL/04821',
    offense: 'Robbery',
    offenseColor: 'warning',
    judge: 'Justice R.K. Sharma',
    expected: '2.1 yrs',
    actual: '5.0 yrs',
    deviation: '+2.9',
    deviationLevel: 'high',
  },
  {
    id: 'CAS/2024/MUM/11293',
    offense: 'Fraud',
    offenseColor: 'accent',
    judge: 'Justice A.K. Desai',
    expected: '1.8 yrs',
    actual: '2.0 yrs',
    deviation: '+0.2',
    deviationLevel: 'low',
  },
  {
    id: 'CAS/2024/LKO/07734',
    offense: 'Assault',
    offenseColor: 'danger',
    judge: 'Justice Meena Agarwal',
    expected: '1.2 yrs',
    actual: '3.5 yrs',
    deviation: '+2.3',
    deviationLevel: 'high',
  },
  {
    id: 'CAS/2024/BLR/00932',
    offense: 'Cybercrime',
    offenseColor: 'accent',
    judge: 'Justice T.V. Krishnan',
    expected: '2.4 yrs',
    actual: '2.6 yrs',
    deviation: '+0.2',
    deviationLevel: 'low',
  },
  {
    id: 'CAS/2024/CHE/15501',
    offense: 'Murder',
    offenseColor: 'danger',
    judge: 'Justice P.S. Nair',
    expected: '12.0 yrs',
    actual: '9.5 yrs',
    deviation: '-2.5',
    deviationLevel: 'medium',
  },
  {
    id: 'CAS/2024/HYD/08812',
    offense: 'Fraud',
    offenseColor: 'accent',
    judge: 'Justice S. Radhakrishnan',
    expected: '1.5 yrs',
    actual: '1.4 yrs',
    deviation: '-0.1',
    deviationLevel: 'low',
  },
];

// ─── Judge Profile Page ───────────────────────────────────────────────────────

export const judgeProfile = {
  name: 'Justice R.K. Sharma',
  court: 'Delhi District Court',
  district: 'Central Delhi',
  yearsActive: '2011–Present',
  anomalyScore: 81,
  offenseBarData: [
    { offense: 'Assault', judge: 4.2, district: 1.8 },
    { offense: 'Robbery', judge: 5.1, district: 2.1 },
    { offense: 'Fraud', offense2: 'Fraud', judge: 3.8, district: 2.4 },
    { offense: 'Murder', judge: 14.2, district: 12.8 },
    { offense: 'Cybercrime', judge: 3.1, district: 2.9 },
  ],
  trendData: [
    { year: '2018', deviation: 0.4 },
    { year: '2019', deviation: 0.9 },
    { year: '2020', deviation: 1.3 },
    { year: '2021', deviation: 2.1 },
    { year: '2022', deviation: 2.7 },
    { year: '2023', deviation: 3.2 },
    { year: '2024', deviation: 2.9 },
  ],
  recentCases: [
    { id: 'CAS/2024/DEL/04821', offense: 'Robbery', expected: '2.1 yrs', actual: '5.0 yrs', deviation: '+2.9', level: 'high' },
    { id: 'CAS/2024/DEL/04103', offense: 'Assault', expected: '1.2 yrs', actual: '3.8 yrs', deviation: '+2.6', level: 'high' },
    { id: 'CAS/2024/DEL/03887', offense: 'Fraud', expected: '2.4 yrs', actual: '2.6 yrs', deviation: '+0.2', level: 'low' },
    { id: 'CAS/2023/DEL/09912', offense: 'Murder', expected: '12.0 yrs', actual: '14.5 yrs', deviation: '+2.5', level: 'high' },
    { id: 'CAS/2023/DEL/07201', offense: 'Cybercrime', expected: '2.1 yrs', actual: '2.3 yrs', deviation: '+0.2', level: 'low' },
    { id: 'CAS/2023/DEL/05543', offense: 'Robbery', expected: '1.9 yrs', actual: '4.8 yrs', deviation: '+2.9', level: 'high' },
  ],
};

// ─── Case Analysis Page ───────────────────────────────────────────────────────

export const caseAnalysis = {
  judgmentText: `IN THE COURT OF ADDITIONAL SESSIONS JUDGE
CENTRAL DISTRICT, NEW DELHI

Case No. CAS/2024/DEL/04821
State vs. Arvind Kumar Joshi

JUDGMENT

This case arises out of FIR No. 0214 of 2023, registered at Police Station Paharganj, District Central Delhi, under Sections 392, 394, and 34 of the Indian Penal Code, 1860.

BRIEF FACTS:
The complainant, Sh. Ramesh Chandra Gupta, aged 54 years, reported that on the night of 12th March 2023, at approximately 23:40 hours, he was accosted by two persons near the Paharganj Metro Station exit while returning from Connaught Place. The accused persons, namely Arvind Kumar Joshi and one juvenile accomplice, allegedly threatened him with a sharp-edged weapon and forcibly dispossessed him of his wallet containing ₹8,200 in cash, one Samsung Galaxy smartphone (valued approximately ₹22,000), and a gold chain.

EVIDENCE ON RECORD:
The prosecution has placed before this Court the testimony of the complainant (PW-1), the investigating officer (PW-4 - SI Deepak Verma), two eyewitnesses (PW-2 and PW-3), CCTV footage from the metro station premises (Exhibit P-7), and forensic examination of the recovered weapon (Exhibit P-12).

The defence has examined the accused himself (DW-1) and his employer (DW-2, Sh. Bharat Lal Meena) who attested to his character.

FINDINGS:
This Court, after carefully evaluating the oral and documentary evidence, finds the testimony of PW-1 to be consistent, credible, and corroborated by the CCTV footage. The identification of the accused in the Test Identification Parade conducted on 24th March 2023 is found to be procedurally valid.

The defence plea of alibi is rejected as it is not substantiated by any independent corroborating evidence.

The accused Arvind Kumar Joshi is accordingly found GUILTY under Section 392 read with Section 34, IPC.

SENTENCE:
Having regard to the gravity of the offence, the use of a weapon, the vulnerability of the victim, and the previous antecedents of the accused (one prior conviction under Section 379 IPC in 2018), this Court is of the considered opinion that a deterrent sentence is warranted.

The accused is sentenced to Rigorous Imprisonment for a period of FIVE YEARS and a fine of ₹10,000, in default of which he shall undergo further Simple Imprisonment of three months.

Bail bonds stand cancelled. The accused is taken into custody forthwith.

Given under my hand and seal of this Court on this 18th day of January, 2024.

                              (R.K. SHARMA)
                    Additional Sessions Judge
                    Central District, New Delhi`,

  aiSummary: [
    'Accused convicted under IPC §392/34 for armed robbery near Paharganj Metro Station; victim dispossessed of cash, phone, and jewellery.',
    'CCTV corroboration and positive TIP identification were central to conviction; alibi defence rejected for lack of independent support.',
    'Prior conviction (§379, 2018) cited as aggravating factor; sentence of 5 years RI is 2.9 years above district median for comparable offenses.',
  ],

  extractedFields: {
    judge: 'Justice R.K. Sharma',
    court: 'Delhi District Court, Central',
    offense: 'Robbery (Armed)',
    ipcSection: 'IPC §392, §394, §34',
    sentenceGiven: '5 years Rigorous Imprisonment',
    bailStatus: 'Denied',
  },

  sentenceComparison: {
    expected: 2.1,
    actual: 5.0,
  },

  shapFeatures: [
    { feature: 'Prior Offenses', value: 1.42, direction: 'positive' },
    { feature: 'Offense Severity', value: 1.18, direction: 'positive' },
    { feature: 'Bail Status', value: 0.87, direction: 'positive' },
    { feature: 'Judge History', value: 0.76, direction: 'positive' },
    { feature: 'IPC Section', value: 0.54, direction: 'positive' },
    { feature: 'Defendant Age', value: -0.31, direction: 'negative' },
    { feature: 'District', value: -0.18, direction: 'negative' },
    { feature: 'Time of Year', value: -0.09, direction: 'negative' },
  ],

  similarCases: [
    { id: 'CAS/2023/DEL/07821', offense: 'Robbery', facts: 'Armed robbery near Lajpat Nagar market; victim robbed of cash and mobile device by two accused at knifepoint. Single prior conviction.', sentence: '2.3 yrs' },
    { id: 'CAS/2022/MUM/04412', offense: 'Robbery', facts: 'Street robbery in Dharavi; complainant accosted near bus stop, dispossessed of wallet. Accused identified via CCTV.', sentence: '1.8 yrs' },
    { id: 'CAS/2023/LKO/09921', offense: 'Robbery', facts: 'Two accused, one weapon, victim aged 60+ years. CCTV evidence, positive TIP. Prior offender.', sentence: '2.8 yrs' },
    { id: 'CAS/2022/CHE/11023', offense: 'Robbery', facts: 'Robbery at petrol bunk; attendant robbed at knifepoint. Accused caught within 48 hours. First-time offender.', sentence: '1.5 yrs' },
    { id: 'CAS/2024/HYD/01108', offense: 'Robbery', facts: 'Accused with two associates robbed complainant outside ATM. CCTV identified all three. Accused had prior §379 conviction.', sentence: '3.1 yrs' },
  ],
};

// ─── Bias Explorer Page ───────────────────────────────────────────────────────

export const heatmapDistricts = [
  'Central Delhi', 'Lucknow', 'Mumbai Suburban', 'Chennai Central',
  'Bengaluru Urban', 'Hyderabad', 'Kolkata', 'Patna',
  'Jaipur', 'Ahmedabad',
];

export const heatmapSentenceRanges = ['0–1 yr', '1–2 yrs', '2–3 yrs', '3–5 yrs', '5–10 yrs', '10+ yrs'];

export const heatmapData = [
  [5, 18, 22, 44, 28, 8],
  [8, 25, 30, 55, 22, 3],
  [12, 32, 28, 38, 18, 5],
  [6, 20, 25, 42, 30, 9],
  [15, 38, 35, 40, 15, 4],
  [9, 22, 27, 48, 24, 6],
  [7, 19, 24, 50, 26, 7],
  [4, 15, 20, 45, 32, 12],
  [10, 28, 33, 43, 20, 5],
  [11, 30, 29, 41, 19, 6],
];

export const globalShapFeatures = [
  { feature: 'Prior Convictions', importance: 1.84 },
  { feature: 'Offense Severity (IPC)', importance: 1.62 },
  { feature: 'Bail Status', importance: 1.31 },
  { feature: 'Judge History Bias', importance: 1.18 },
  { feature: 'Victim Demographics', importance: 0.94 },
  { feature: 'District of Trial', importance: 0.87 },
  { feature: 'Defendant Age', importance: 0.71 },
  { feature: 'Case Duration', importance: 0.54 },
];

export const biasInsight = {
  headline: 'Districts in Uttar Pradesh sentence assault cases 2.3× above the national median.',
  stats: [
    'Lucknow: avg sentence 3.8 yrs vs. national median 1.6 yrs for IPC §323–325',
    'Bail denial rate in UP assault cases: 78% vs. 51% national average',
    'Top predictor of excess sentencing: Judge tenure > 10 years (SHAP: +1.31)',
  ],
};

// ─── Similarity Search Page ───────────────────────────────────────────────────

export const similarityResults = [
  {
    score: 94,
    id: 'CAS/2023/DEL/07821',
    offense: 'Robbery',
    summary: 'Two accused armed with a knife accosted a 54-year-old near a metro station in Central Delhi at night. Victim dispossessed of cash, phone, and gold jewellery; CCTV evidence and TIP secured.',
    sentence: '2.3 yrs',
    judge: 'Justice S.K. Mehta',
    year: 2023,
  },
  {
    score: 89,
    id: 'CAS/2022/LKO/09921',
    offense: 'Robbery',
    summary: 'Single accused with sharpened rod robbed a 60-year-old shopkeeper near Hazratganj market. Prior §379 conviction established. Positive TIP, CCTV corroboration.',
    sentence: '2.8 yrs',
    judge: 'Justice Priya Saxena',
    year: 2022,
  },
  {
    score: 83,
    id: 'CAS/2022/MUM/04412',
    offense: 'Robbery',
    summary: 'Street robbery in Dharavi; complainant accosted by two persons near bus stop and dispossessed of wallet and mobile. Accused identified via ATM CCTV footage.',
    sentence: '1.8 yrs',
    judge: 'Justice A.K. Desai',
    year: 2022,
  },
  {
    score: 77,
    id: 'CAS/2024/HYD/01108',
    offense: 'Robbery',
    summary: 'Three accused robbed complainant outside HDFC ATM in Banjara Hills. Accused had prior §379 conviction. All identified via CCTV; weapon (iron rod) recovered.',
    sentence: '3.1 yrs',
    judge: 'Justice S. Radhakrishnan',
    year: 2024,
  },
  {
    score: 71,
    id: 'CAS/2023/BLR/03341',
    offense: 'Robbery',
    summary: 'Victim robbed near Majestic Bus Stand by two accused on motorcycle who snatched chain and fled. One accused apprehended, one absconding. TIP positive.',
    sentence: '1.5 yrs',
    judge: 'Justice T.V. Krishnan',
    year: 2023,
  },
];
