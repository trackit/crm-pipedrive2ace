<h1 align="center">Pipedrive2ACE Automation Tool</h1>

<p align="center">
  <b>Pipedrive2ACE</b> is a lambda webhook receiver that automates the process of entering Pipedrive deals into AWS Partner Central ACE Pipeline Manager.
</p>

<hr>

<p align="center">
  <a href="https://github.com/trackit/crm-pipedrive2ace/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/trackit/crm-pipedrive2ace"></a>
  <a href="https://trackit.io/"><img alt="Website" src="https://img.shields.io/badge/website-trackit.io-blue"></a>
</p>

<hr>

# Table of contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Build](#build)
  - [Deploy](#deploy)
  - [Pipedrive Webhook](#pipedrive-webhook)
- [Contributing](#contributing)
- [License](#license)

# Overview

This repository allows you to connect Pipedrive CRM with AWS Partner Central ACE Pipeline Manager.
It works with a lambda syncing Pipedrive deals to AWS ACE Pipeline Manager opportunities.

# Getting Started

## Prerequisites

In order to use this tool, you will need to configure it depending on your pipedrive setup.
Here are the types for the tool configuration:

```typescript
// Represents a value match mapping.
export interface ValueMapping {
  // The Pipedrive value or ID.
  pipedriveValue: number | string,
  // The PCS value to put in the field for the pipedriveValue.
  pcsValue: number | string | number[] | string[],
}

// Represents a single mapping from Pipedrive to PCS Company.
export interface CompanyFieldMapping {
  // Do not support monetary fields. True if the field is plain value (text, double) and false if it is a set or enum (because they are ids and need to be retrieved from Pipedrive).
  plainValue: boolean,
  // The PCS field.
  opportunityField: string,
  // The value mapping to use. If null, the value is used as is.
  valueMapping: ValueMapping[] | null,
}

// Represents a single mapping from Pipedrive to PCS Opportunity.
export interface OpportunityFieldMapping {
  /*
   * The Pipedrive sub key of the field to map.
   * Pipedrive sub keys types depends on the Pipedrive field type:
   *
   * Field types: Sub key(s)
   * 
   * text: value
   * monetary: value, currency
   * set: values
   * enum: id
   * double: value
   */
  pipedriveSubKey: string,
  // The PCS field.
  opportunityField: string,
  // The value mapping to use. If null, the value is used as is.
  valueMapping: ValueMapping[] | null,
}

// Represents a mapping from Pipedrive to PCS Company.
export type CompanyMapping = CompanyMappingOrganization | CompanyMappingDeal;

// Represents a mapping from Pipedrive Organization to PCS Company.
export interface CompanyMappingOrganization {
  // Type of mapping. Either sourced from the Pipedrive deal or the Pipedrive organization. Here it is from the organization.
  from: 'organization',
  // The Pipedrive key of the field to map.
  pipedriveKey: string,
  // The PCS field config to map to.
  mapping: CompanyFieldMapping[],
}

// Represents a mapping from Pipedrive Deal to PCS Company.
export interface CompanyMappingDeal {
  // Type of mapping. Either sourced from the Pipedrive deal or the Pipedrive organization. Here it is from the deal.
  from: 'deal',
  // The Pipedrive key of the field to map.
  pipedriveKey: string,
  // The PCS field config to map to.
  mapping: OpportunityFieldMapping[],
}

// Represents a mapping from Pipedrive to PCS Opportunity.
export interface OpportunityMapping {
  // The Pipedrive key of the field to map.
  pipedriveKey: string,
  // The PCS field config to map to.
  mapping: OpportunityFieldMapping[],
}

// Represents a value mapping from a Pipedrive stage to a PCS stage
export interface StageValueMapping {
  // The Pipedrive stage value ID.
  pipedriveId: number,
  // The PCS stage value
  pcsValue: string,
}

// Represents the global configuration of stages.
export interface StageMapping {
  // List of value mappings from Pipedrive stages to PCS stages. Won/Lost value overrides the stage value mapping.
  valueMapping: StageValueMapping[],
  // The value to put in PCS when the deal is lost.
  lostPcsValue: string,
  // The value to put in PCS when the deal is won.
  wonPcsValue: string,
}

// Represents the global configuration.
export interface GlobalConfig {
  // Field mappings for PCS Company.
  companyFieldsMapping: CompanyMapping[],
  // Field mappings for PCS Opportunity.
  opportunityFieldsMapping: OpportunityMapping[],
  // Field that is used to know if the deal will be synchronized or not.
  syncWithAceField: {
    // The field key in Pipedrive that is used to know if the deal will be synchronized or not.
    fieldKey: string,
    // The field value ID in Pipedrive for YES.
    yesValue: number,
    // The field value ID in Pipedrive for NO.
    noValue: number,
  }
  // Global configuration for stages
  stageMapping: StageMapping,
  // User ID used to send the note feedback to the deal in Pipedrive.
  noteUserId: number,
  // The partner name used in the opportunity.
  partnerName: string,
  // Text value in the list of solutions to know if we need to fill the otherSolutions field.
  otherSolutionsValue: string,
}
```

You should create a configuration file with the path `src/config.ts` and the following content:



```typescript
import { GlobalConfig } from './migration/datastructures/Configuration';

export const globalConfig: GlobalConfig = {
...
}
```

## Build

### Dependencies

Run:
```bash
$> npm install
```
to install the dependencies.

### AWS Credentials

The AWS account must be linked to AWS Partner Central ACE Pipeline Manager in order for this to work.
You can use:
```bash
$> aws configure
```
to set up your AWS credentials or use a tool like `aws-vault` to manage your credentials.

### Pipedrive API Key

You need to create a Pipedrive API key. You can do this by going to your Pipedrive account settings and creating a new API key.

### Secrets

You need to set 3 secrets:
- `PIPEDRIVE_API_KEY`: The Pipedrive API key you created in the previous step.
- `AUTH_USERNAME`: The username for the Lambda URL Basic Auth.
- `AUTH_PASSWORD`: The password for the Lambda URL Basic Auth.

To do so: 
```bash
$> npm run secret <SECRET_NAME> <SECRET_VALUE>
```

You need to do it for each secret.

## Deploy

Run:
```bash
$> npm run deploy
``` 
to deploy the lambda function to AWS.
The stack will output the Lambda function URL that you will need to create the webhook in Pipedrive.

## Pipedrive Webhook

Go to Pipedrive > `Tools and Apps` > `Webhooks` > `+ Webhook` > `Webhook`

Select `Webhooks V2`, then Next and fill it like this:
- Event action: `*`
- Event object: `deal`
- User permission level: Select the admin user.
- Webhook Name: `AWS ACE Pipeline Manager`
- Endpoint URL: `<LAMBDA_URL>` (the URL outputted by the SST deployment)
- HTTP Auth username: `<AUTH_USERNAME>` (the username you set in the secrets)
- HTTP Auth password: `<AUTH_PASSWORD>` (the password you set in the secrets)

# Contributing

We welcome contributions to the project.

Please read our [contributing guidelines](./CONTRIBUTING.md) for more information on how to get started.

# License

Copyright 2025 TrackIt

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  [LICENSE](./LICENSE)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
