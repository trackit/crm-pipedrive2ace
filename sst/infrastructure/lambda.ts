const authUsername = new sst.Secret('AUTH_USERNAME', 'not-a-real-username');
const authPassword = new sst.Secret('AUTH_PASSWORD', 'not-a-real-password');
const pipedriveApiKey = new sst.Secret('PIPEDRIVE_API_KEY', 'not-a-real-key');

export const lambda = new sst.aws.Function("pipedrive-crm", {
  url: true,
  name: 'pipedrive-to-partner-central-selling',
  runtime: 'nodejs20.x',
  handler: 'src/migration/handler/handler.main',
  environment: {
    AUTH_USERNAME: authUsername.value,
    AUTH_PASSWORD: authPassword.value,
    CATALOG: 'Sandbox',
    PARTNER_NAME: 'TrackIt',
    PIPEDRIVE_API_KEY: pipedriveApiKey.value,
    SYNC_FIELD_ID: 'd65e61d1ec0fb8a6467a550f3d7e97a02972d5b5',
    SYNC_FIELD_YES_ID: '334',
    SYNC_FIELD_NO_ID: '335',
  },
  tags: {
    'Name': 'pipedrive-crm',
    'Owner': 'Jules Klakosz',
    'Project': 'pipedrive-crm',
  }
});
