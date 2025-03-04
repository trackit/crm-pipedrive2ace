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

export type OpportunityStage =
  | 'Prospect'
  | 'Qualified'
  | 'Technical Validation'
  | 'Business Validation'
  | 'Committed'
  | 'Launched'
  | 'Closed Lost';

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
  | 'Computer and Electronics'
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
  | 'Transport and Logistics'
  | 'Travel'
  | 'Wholesale and Distribution';

// Fields en trop dans pipedrive:
// - Sports
// - Web3 & Crypto
// - Social Services
//
//
// - Life Sciences et Healthcare sont ensemble dans pipedrive

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

export type OpportunityExpectedCustomerSpend = {
  currency: OpportunityCurrencyCode,
  amount: string,
  frequency: 'Monthly',
  target: string,
}

export interface Opportunity {
  id?: string,
  dealId: string,
  title: string,
  stage: OpportunityStage,
  businessProblem: string,
  company: {
    name: string,
    contact: {
      email: string,
      phone: string,
      firstName: string,
      lastName: string,
    }
    address: string,
    website: string,
    industry: OpportunityIndustry,
  },
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
}

