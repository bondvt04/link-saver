// IMPORTANT NOTE - The refresh_token is only returned on the first authorization.
// If you need to generate it again, draw rights back on https://myaccount.google.com/permissions
// More details here: https://github.com/googleapis/google-api-nodejs-client/issues/750#issuecomment-304521450

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const {google} = require('googleapis');

import * as config from './config';
const { CLIENT_SECRET_FILE_PATH, OAUTH_CALLBACK_LEFT, OAUTH_CALLBACK_PATH, OAUTH_CALLBACK_PORT, SHEETS_SCOPE, GOOGLE_TOKENS_FILE_PATH } = config;

// To use OAuth2 authentication, we need access to CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI.
// To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
// Create your creds and download client_secret*.json file
const keyPath: any = path.join(__dirname, CLIENT_SECRET_FILE_PATH);
let keys: any = {redirect_uris: ['']};
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

// This is one of the many ways you can configure googleapis to use authentication credentials.
// In this method, we're setting a global reference for all APIs.
// Any other API you use here, like google.drive('v3'), will now use this auth client.
// You can also override the auth client at the service and method call levels ;)
google.options({auth: oauth2Client});

// Run an http server to accept the oauth callback.
// The only request to our webserver is to /callback?code=<authorizationCode>
async function authenticate(scopes: any) {
    return new Promise((resolve: any, reject: any) => {
      // authorizeUrl generating here from client_scret.json and scopes
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });
      const server = http
        .createServer(async (req: any, res: any) => {
          try {
            if (req.url.indexOf(OAUTH_CALLBACK_PATH) > -1) {
              const qs = new url.URL(req.url, OAUTH_CALLBACK_LEFT)
                .searchParams;
              res.end('Authentication successful! Please return to the console.');
              server.destroy();
              const { tokens } = await oauth2Client.getToken(qs.get('code'));
              resolve(tokens);
            }
          } catch (e: any) {
            reject(e);
          }
        })
        .listen(OAUTH_CALLBACK_PORT, () => {
          // open the browser to the authorize url to start the workflow
          opn(authorizeUrl, { wait: false })
            .then((cp: any) => cp.unref())
            .catch(console.error);
        });
      destroyer(server);
    });
  }

// How to use tokens json:
// oauth2Client.credentials = tokens;
async function writeTokensToDisk(tokens: any) {
  let data = JSON.stringify(tokens);
  fs.writeFileSync(GOOGLE_TOKENS_FILE_PATH, data);
}

const scopes = [
  SHEETS_SCOPE
];
authenticate(scopes)
  .then((tokens: any) => writeTokensToDisk(tokens))
  .catch(console.error);
