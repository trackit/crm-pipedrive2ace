# Pipedrive CRM to AWS ACE

## Overview

This repository allows you to connect Pipedrive CRM with AWS Partner Central ACE Pipeline Manager.
It works with a lambda syncing Pipedrive deals to AWS ACE Pipeline Manager opportunities.

## Prerequisites

### Configuration types

Here are the types for the configuration of the mapping.

```typescript
export interface ValueMapping {
  pipedriveValue: number | string,
  pcsValue: number | string | number[] | string[],
}

export interface OrganizationFieldMapping {
  plainValue: boolean,
  opportunityField: string,
  valueMapping: ValueMapping[] | null,
}

export interface DealFieldMapping {
  pipedriveSubKey: string,
  opportunityField: string,
  valueMapping: ValueMapping[] | null,
}

export type OrganizationMapping = OrganizationMappingOrganization | OrganizationMappingDeal;

export interface OrganizationMappingOrganization {
  from: 'organization',
  pipedriveKey: string,
  mapping: OrganizationFieldMapping[],
}

export interface OrganizationMappingDeal {
  from: 'deal',
  pipedriveKey: string,
  mapping: DealFieldMapping[],
}


export interface DealMapping {
  pipedriveKey: string,
  mapping: DealFieldMapping[],
}

export interface StageValueMapping {
  pipedriveId: number,
  pcsValue: string,
}

export interface StageMapping {
  valueMapping: StageValueMapping[],
  lostPcsValue: string,
  wonPcsValue: string,
}

export interface GlobalConfig {
  organizationFieldsMapping: OrganizationMapping[],
  dealFieldsMapping: DealMapping[],
  syncWithAceField: {
    fieldKey: string,
    yesValue: number,
    noValue: number,
  }
  stageMapping: StageMapping,
  noteUserId: number,
  partnerName: string,
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

## Installation

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

### Deployment using SST

Run:
```bash
$> npm run deploy
``` 
to deploy the lambda function to AWS.
The stack will output the Lambda function URL that you will need to create the webhook in Pipedrive.

### Pipedrive Webhook

Go to Pipedrive > `Tools and Apps` > `Webhooks` > `+ Webhook` > `Webhook`

Select `Webhooks V2`, then Next and fill it like this:
- Event action: `*`
- Event object: `deal`
- User permission level: Select the admin user.
- Webhook Name: `AWS ACE Pipeline Manager`
- Endpoint URL: `<LAMBDA_URL>` (the URL outputted by the SST deployment)
- HTTP Auth username: `<AUTH_USERNAME>` (the username you set in the secrets)
- HTTP Auth password: `<AUTH_PASSWORD>` (the password you set in the secrets)
