const authUsername = new sst.Secret('AUTH_USERNAME', 'not-a-real-username');
const authPassword = new sst.Secret('AUTH_PASSWORD', 'not-a-real-password');
const pipedriveApiKey = new sst.Secret('PIPEDRIVE_API_KEY', 'not-a-real-key');

const role = new aws.iam.Role("pipedrive-to-partner-central-selling-role", {
  name: "pipedrive-to-partner-central-selling-role",
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Sid: "AllowLambdaServicePrincipal",
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Principal: {
          Service: "lambda.amazonaws.com",
      },
    }],
  }),
  inlinePolicies: [
    {
      name: 'AllowLogs',
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Action: ['logs:*'],
          Effect: 'Allow',
          Resource: '*',
        }],
      }),
    },
    {
      name: "AllowPartnerCentralSelling",
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Action: [
            'partnercentral:CreateOpportunity',
            'partnercentral:ListOpportunities',
            'partnercentral:UpdateOpportunity',
            'partnercentral:GetOpportunity',
            'partnercentral:AssociateOpportunity',
            'partnercentral:DisassociateOpportunity',
          ],
          Effect: 'Allow',
          Resource: '*',
        }],
      }),
    }
  ],
  tags: {
    'Name': 'pipedrive-crm',
    'Owner': 'TrackIt',
    'Project': 'pipedrive-crm',
  }
});

export const lambda = new sst.aws.Function("pipedrive-to-partner-central-selling", {
  url: true,
  name: 'pipedrive-to-partner-central-selling',
  runtime: 'nodejs20.x',
  handler: 'src/migration/handler/handler.main',
  role: role.arn,
  environment: {
    AUTH_USERNAME: authUsername.value,
    AUTH_PASSWORD: authPassword.value,
    PIPEDRIVE_API_KEY: pipedriveApiKey.value,
  },
  tags: {
    'Name': 'pipedrive-crm',
    'Owner': 'TrackIt',
    'Project': 'pipedrive-crm',
  }
});
