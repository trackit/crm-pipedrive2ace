export type OpportunityUseCase =
  | 'AI Machine Learning and Analytics'
  | 'Archiving'
  | 'Big Data: Data Warehouse/ Data Integration/ ETL/ Data Lake/ BI'
  | 'Blockchain'
  | 'Business Applications: Mainframe Modernization'
  | 'Business Applications & Contact Center'
  | 'Business Applications & SAP Production'
  | 'Centralized Operations Management'
  | 'Cloud Management Tools'
  | 'Cloud Management Tools & DevOps with Continuous Integration & Continuous Delivery (CICD)'
  | 'Configuration, Compliance & Auditing'
  | 'Connected Services'
  | 'Containers & Serverless'
  | 'Content Delivery & Edge Services'
  | 'Database'
  | 'Edge Computing/ End User Computing'
  | 'Energy'
  | 'Enterprise Governance & Controls'
  | 'Enterprise Resource Planning'
  | 'Financial Services'
  | 'Healthcare and Life Sciences'
  | 'High Performance Computing'
  | 'Hybrid Application Platform'
  | 'Industrial Software'
  | 'IOT'
  | 'Manufacturing, Supply Chain and Operations'
  | 'Media & High performance computing (HPC)'
  | 'Migration/ Database Migration'
  | 'Monitoring, logging and performance'
  | 'Monitoring & Observability'
  | 'Networking'
  | 'Outpost'
  | 'SAP'
  | 'Security & Compliance'
  | 'Storage & Backup'
  | 'Training'
  | 'VMC'
  | 'VMWare'
  | 'Web development & DevOps';

export const OPPORTUNITY_STAGES = [
  'Prospect',
  'Qualified',
  'Technical Validation',
  'Business Validation',
  'Committed',
  'Launched',
  'Closed Lost'
] as const;

export type OpportunityStage = typeof OPPORTUNITY_STAGES[number];

export type OpportunityOrigin =
  | 'AWS Referral'
  | 'Partner Referral';

export type OpportunityDeliveryModel =
  | 'SaaS or PaaS'
  | 'BYOL or AMI'
  | 'Managed Services'
  | 'Professional Services'
  | 'Resell'
  | 'Other';

export type OpportunitySalesActivity =
  | 'Agreed on solution to Business Problem'
  | 'Completed Action Plan'
  | 'Conducted POC / Demo'
  | 'Customer has shown interest in solution'
  | 'Finalized Deployment Need'
  | 'Initialized discussions with customer'
  | 'In evaluation / planning stage'
  | 'SOW Signed';

export type OpportunityPrimaryNeedFromAws =
  | 'Co-Sell - Architectural Validation'
  | 'Co-Sell - Business Presentation'
  | 'Co-Sell - Competitive Information'
  | 'Co-Sell - Deal Support'
  | 'Co-Sell - Pricing Assistance'
  | 'Co-Sell - Support for Public Tender / RFx'
  | 'Co-Sell - Technical Consultation'
  | 'Co-Sell - Total Cost of Ownership Evaluation';

export type OpportunityMarketingSource =
  | 'Marketing Activity'
  | 'None';

export type OpportunityCompetitorName =
  | 'Akamai'
  | 'AliCloud'
  | 'Co-location'
  | 'Google Cloud Platform'
  | 'IBM Softlayer'
  | 'Microsoft Azure'
  | 'No Competition'
  | 'On-Prem'
  | 'Oracle Cloud'
  | '*Other'
  | 'Other- Cost Optimization';

export type OpportunityIndustry =
  | 'Aerospace'
  | 'Agriculture'
  | 'Automotive'
  | 'Computers and Electronics'
  | 'Consumer Goods'
  | 'Education'
  | 'Energy - Oil and Gas'
  | 'Energy - Power and Utilities'
  | 'Financial Services'
  | 'Gaming'
  | 'Government'
  | 'Healthcare'
  | 'Hospitality'
  | 'Life Sciences'
  | 'Manufacturing'
  | 'Marketing and Advertising'
  | 'Media and Entertainment'
  | 'Mining'
  | 'Non-Profit Organization'
  | 'Other'
  | 'Professional Services'
  | 'Real Estate and Construction'
  | 'Retail'
  | 'Software and Internet'
  | 'Telecommunications'
  | 'Transportation and Logistics'
  | 'Travel'
  | 'Wholesale and Distribution';

export type OpportunityType =
  | 'Net New Business'
  | 'Flat Renewal'
  | 'Expansion';

export type OpportunityCurrencyCode =
  | "AED"
  | "AFN"
  | "ALL"
  | "AMD"
  | "ANG"
  | "AOA"
  | "ARS"
  | "AUD"
  | "AWG"
  | "AZN"
  | "BAM"
  | "BBD"
  | "BDT"
  | "BGN"
  | "BHD"
  | "BIF"
  | "BMD"
  | "BND"
  | "BOB"
  | "BOV"
  | "BRL"
  | "BSD"
  | "BTN"
  | "BWP"
  | "BYN"
  | "BZD"
  | "CAD"
  | "CDF"
  | "CHE"
  | "CHF"
  | "CHW"
  | "CLF"
  | "CLP"
  | "CNY"
  | "COP"
  | "COU"
  | "CRC"
  | "CUC"
  | "CUP"
  | "CVE"
  | "CZK"
  | "DJF"
  | "DKK"
  | "DOP"
  | "DZD"
  | "EGP"
  | "ERN"
  | "ETB"
  | "EUR"
  | "FJD"
  | "FKP"
  | "GBP"
  | "GEL"
  | "GHS"
  | "GIP"
  | "GMD"
  | "GNF"
  | "GTQ"
  | "GYD"
  | "HKD"
  | "HNL"
  | "HRK"
  | "HTG"
  | "HUF"
  | "IDR"
  | "ILS"
  | "INR"
  | "IQD"
  | "IRR"
  | "ISK"
  | "JMD"
  | "JOD"
  | "JPY"
  | "KES"
  | "KGS"
  | "KHR"
  | "KMF"
  | "KPW"
  | "KRW"
  | "KWD"
  | "KYD"
  | "KZT"
  | "LAK"
  | "LBP"
  | "LKR"
  | "LRD"
  | "LSL"
  | "LYD"
  | "MAD"
  | "MDL"
  | "MGA"
  | "MKD"
  | "MMK"
  | "MNT"
  | "MOP"
  | "MRU"
  | "MUR"
  | "MVR"
  | "MWK"
  | "MXN"
  | "MXV"
  | "MYR"
  | "MZN"
  | "NAD"
  | "NGN"
  | "NIO"
  | "NOK"
  | "NPR"
  | "NZD"
  | "OMR"
  | "PAB"
  | "PEN"
  | "PGK"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RSD"
  | "RUB"
  | "RWF"
  | "SAR"
  | "SBD"
  | "SCR"
  | "SDG"
  | "SEK"
  | "SGD"
  | "SHP"
  | "SLL"
  | "SOS"
  | "SRD"
  | "SSP"
  | "STN"
  | "SVC"
  | "SYP"
  | "SZL"
  | "THB"
  | "TJS"
  | "TMT"
  | "TND"
  | "TOP"
  | "TRY"
  | "TTD"
  | "TWD"
  | "TZS"
  | "UAH"
  | "UGX"
  | "USD"
  | "USN"
  | "UYI"
  | "UYU"
  | "UZS"
  | "VEF"
  | "VND"
  | "VUV"
  | "WST"
  | "XAF"
  | "XCD"
  | "XDR"
  | "XOF"
  | "XPF"
  | "XSU"
  | "XUA"
  | "YER"
  | "ZAR"
  | "ZMW"
  | "ZWL";

export enum CountryCodeMap {
  Afghanistan = 'AF',
  AlandIslands = 'AX',
  Albania = 'AL',
  Algeria = 'DZ',
  AmericanSamoa = 'AS',
  Andorra = 'AD',
  Angola = 'AO',
  Anguilla = 'AI',
  Antarctica = 'AQ',
  AntiguaAndBarbuda = 'AG',
  Argentina = 'AR',
  Armenia = 'AM',
  Aruba = 'AW',
  Australia = 'AU',
  Austria = 'AT',
  Azerbaijan = 'AZ',
  Bahamas = 'BS',
  Bahrain = 'BH',
  Bangladesh = 'BD',
  Barbados = 'BB',
  Belarus = 'BY',
  Belgium = 'BE',
  Belize = 'BZ',
  Benin = 'BJ',
  Bermuda = 'BM',
  Bhutan = 'BT',
  Bolivia = 'BO',
  BonaireSintEustatiusSaba = 'BQ',
  BosniaAndHerzegovina = 'BA',
  Botswana = 'BW',
  BouvetIsland = 'BV',
  Brazil = 'BR',
  BritishIndianOceanTerritory = 'IO',
  BruneiDarussalam = 'BN',
  Bulgaria = 'BG',
  BurkinaFaso = 'BF',
  Burundi = 'BI',
  Cambodia = 'KH',
  Cameroon = 'CM',
  Canada = 'CA',
  CapeVerde = 'CV',
  CaymanIslands = 'KY',
  CentralAfricanRepublic = 'CF',
  Chad = 'TD',
  Chile = 'CL',
  China = 'CN',
  ChristmasIsland = 'CX',
  CocosKeelingIslands = 'CC',
  Colombia = 'CO',
  Comoros = 'KM',
  Congo = 'CG',
  CongoDemocraticRepublic = 'CD',
  CookIslands = 'CK',
  CostaRica = 'CR',
  CoteDIvoire = 'CI',
  Croatia = 'HR',
  Cuba = 'CU',
  Curacao = 'CW',
  Cyprus = 'CY',
  CzechRepublic = 'CZ',
  Denmark = 'DK',
  Djibouti = 'DJ',
  Dominica = 'DM',
  DominicanRepublic = 'DO',
  Ecuador = 'EC',
  Egypt = 'EG',
  ElSalvador = 'SV',
  EquatorialGuinea = 'GQ',
  Eritrea = 'ER',
  Estonia = 'EE',
  Ethiopia = 'ET',
  FalklandIslands = 'FK',
  FaroeIslands = 'FO',
  Fiji = 'FJ',
  Finland = 'FI',
  France = 'FR',
  FrenchGuiana = 'GF',
  FrenchPolynesia = 'PF',
  FrenchSouthernTerritories = 'TF',
  Gabon = 'GA',
  Gambia = 'GM',
  Georgia = 'GE',
  Germany = 'DE',
  Ghana = 'GH',
  Gibraltar = 'GI',
  Greece = 'GR',
  Greenland = 'GL',
  Grenada = 'GD',
  Guadeloupe = 'GP',
  Guam = 'GU',
  Guatemala = 'GT',
  Guernsey = 'GG',
  Guinea = 'GN',
  GuineaBissau = 'GW',
  Guyana = 'GY',
  Haiti = 'HT',
  HeardIslandMcdonaldIslands = 'HM',
  HolySeeVaticanCityState = 'VA',
  Honduras = 'HN',
  HongKong = 'HK',
  Hungary = 'HU',
  Iceland = 'IS',
  India = 'IN',
  Indonesia = 'ID',
  Iran = 'IR',
  Iraq = 'IQ',
  Ireland = 'IE',
  IsleOfMan = 'IM',
  Israel = 'IL',
  Italy = 'IT',
  Jamaica = 'JM',
  Japan = 'JP',
  Jersey = 'JE',
  Jordan = 'JO',
  Kazakhstan = 'KZ',
  Kenya = 'KE',
  Kiribati = 'KI',
  Korea = 'KR',
  KoreaDemocraticPeoplesRepublic = 'KP',
  Kuwait = 'KW',
  Kyrgyzstan = 'KG',
  LaoPeoplesDemocraticRepublic = 'LA',
  Latvia = 'LV',
  Lebanon = 'LB',
  Lesotho = 'LS',
  Liberia = 'LR',
  LibyanArabJamahiriya = 'LY',
  Liechtenstein = 'LI',
  Lithuania = 'LT',
  Luxembourg = 'LU',
  Macao = 'MO',
  Macedonia = 'MK',
  Madagascar = 'MG',
  Malawi = 'MW',
  Malaysia = 'MY',
  Maldives = 'MV',
  Mali = 'ML',
  Malta = 'MT',
  MarshallIslands = 'MH',
  Martinique = 'MQ',
  Mauritania = 'MR',
  Mauritius = 'MU',
  Mayotte = 'YT',
  Mexico = 'MX',
  Micronesia = 'FM',
  Moldova = 'MD',
  Monaco = 'MC',
  Mongolia = 'MN',
  Montenegro = 'ME',
  Montserrat = 'MS',
  Morocco = 'MA',
  Mozambique = 'MZ',
  Myanmar = 'MM',
  Namibia = 'NA',
  Nauru = 'NR',
  Nepal = 'NP',
  Netherlands = 'NL',
  NewCaledonia = 'NC',
  NewZealand = 'NZ',
  Nicaragua = 'NI',
  Niger = 'NE',
  Nigeria = 'NG',
  Niue = 'NU',
  NorfolkIsland = 'NF',
  NorthernMarianaIslands = 'MP',
  Norway = 'NO',
  Oman = 'OM',
  Pakistan = 'PK',
  Palau = 'PW',
  PalestinianTerritory = 'PS',
  Panama = 'PA',
  PapuaNewGuinea = 'PG',
  Paraguay = 'PY',
  Peru = 'PE',
  Philippines = 'PH',
  Pitcairn = 'PN',
  Poland = 'PL',
  Portugal = 'PT',
  PuertoRico = 'PR',
  Qatar = 'QA',
  Reunion = 'RE',
  Romania = 'RO',
  RussianFederation = 'RU',
  Rwanda = 'RW',
  SaintBarthelemy = 'BL',
  SaintHelena = 'SH',
  SaintKittsAndNevis = 'KN',
  SaintLucia = 'LC',
  SaintMartin = 'MF',
  SaintPierreAndMiquelon = 'PM',
  SaintVincentAndGrenadines = 'VC',
  Samoa = 'WS',
  SanMarino = 'SM',
  SaoTomeAndPrincipe = 'ST',
  SaudiArabia = 'SA',
  Senegal = 'SN',
  Serbia = 'RS',
  Seychelles = 'SC',
  SierraLeone = 'SL',
  Singapore = 'SG',
  SintMaarten = 'SX',
  Slovakia = 'SK',
  Slovenia = 'SI',
  SolomonIslands = 'SB',
  Somalia = 'SO',
  SouthAfrica = 'ZA',
  SouthGeorgiaAndSandwichIsl = 'GS',
  SouthSudan = 'SS',
  Spain = 'ES',
  SriLanka = 'LK',
  Sudan = 'SD',
  Suriname = 'SR',
  SvalbardAndJanMayen = 'SJ',
  Swaziland = 'SZ',
  Sweden = 'SE',
  Switzerland = 'CH',
  SyrianArabRepublic = 'SY',
  Taiwan = 'TW',
  Tajikistan = 'TJ',
  Tanzania = 'TZ',
  Thailand = 'TH',
  TimorLeste = 'TL',
  Togo = 'TG',
  Tokelau = 'TK',
  Tonga = 'TO',
  TrinidadAndTobago = 'TT',
  Tunisia = 'TN',
  Turkey = 'TR',
  Turkmenistan = 'TM',
  TurksAndCaicosIslands = 'TC',
  Tuvalu = 'TV',
  Uganda = 'UG',
  Ukraine = 'UA',
  UnitedArabEmirates = 'AE',
  UnitedKingdom = 'GB',
  UnitedStates = 'US',
  UnitedStatesOutlyingIslands = 'UM',
  Uruguay = 'UY',
  Uzbekistan = 'UZ',
  Vanuatu = 'VU',
  Venezuela = 'VE',
  Vietnam = 'VN',
  VirginIslandsBritish = 'VG',
  VirginIslandsUS = 'VI',
  WallisAndFutuna = 'WF',
  WesternSahara = 'EH',
  Yemen = 'YE',
  Zambia = 'ZM',
  Zimbabwe = 'ZW',
}

export type OpportunityExpectedCustomerSpend = {
  currency: OpportunityCurrencyCode,
  amount: number,
  frequency: 'Monthly',
  target: string,
}

export interface OpportunityCompanyContact {
  email: string,
  phone: string,
  firstName: string,
  lastName: string,
}

export interface OpportunityCompanyAddress {
  city: string,
  postalCode: string,
  stateOrRegion: string,
  countryCode: string,
  streetAddress: string,
}

export interface OpportunityCompany {
  name: string,
  contact: OpportunityCompanyContact
  address: OpportunityCompanyAddress,
  website: string,
  industry: OpportunityIndustry,
}

export interface OpportunityTeam {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  businessTitle: string,
}

export type OpportunityAwsFundingUsed = 'Yes' | 'No';

export interface Opportunity {
  id?: string,
  awsAccountId: string,
  updateTime: string,
  dealId: number,
  title: string,
  stage: OpportunityStage,
  businessProblem: string,
  company: OpportunityCompany,
  competitorName: OpportunityCompetitorName,
  otherCompetitorNames: string,
  targetCloseDate: string,
  origin: OpportunityOrigin,
  useCase: OpportunityUseCase,
  deliveryModel: OpportunityDeliveryModel[],
  expectedCustomerSpend: OpportunityExpectedCustomerSpend,
  primaryNeedsFromAws: OpportunityPrimaryNeedFromAws[],
  salesActivities: OpportunitySalesActivity[],
  type: OpportunityType,
  marketingSource: OpportunityMarketingSource,
  awsFundingUsed: OpportunityAwsFundingUsed,
  opportunityTeam: OpportunityTeam,
  solutions: string[],
  otherSolutions: string,
  products: string[],
}

