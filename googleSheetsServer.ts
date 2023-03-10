// IMPORTANT NOTE - The refresh_token is only returned on the first authorization.
// If you need to generate it again, draw rights back on https://myaccount.google.com/permissions
// More details here: https://github.com/googleapis/google-api-nodejs-client/issues/750#issuecomment-304521450

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

import tables from './tables';

import * as config from './config';
const { CLIENT_SECRET_FILE_PATH, GOOGLE_TOKENS_FILE_PATH, LOCAL_SERVER_PORT } = config;

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

const tokensPath: any = path.join(__dirname, GOOGLE_TOKENS_FILE_PATH);
let tokens: any = {};
if (fs.existsSync(tokensPath)) {
  tokens = require(tokensPath);
}

oauth2Client.credentials = tokens;

// This is one of the many ways you can configure googleapis to use authentication credentials.
// In this method, we're setting a global reference for all APIs.
// Any other API you use here, like google.drive('v3'), will now use this auth client.
// You can also override the auth client at the service and method call levels ;)
google.options({auth: oauth2Client});

const sheets = google.sheets('v4');

app.get('/write-href-to-google-sheet', async (req: any, res: any) => {
  // req.connection.setTimeout( 1000 * 60 * 10 ); // avoid duplicated queries
  if (req.method === 'OPTIONS') {
    return;
  }
  const parsed = url.parse(req.url, true);
  const { tableName, tabName, href } = parsed.query;

  if (req.method !== 'GET') {
    return res.status(400).json({status: 400, message: 'method should be GET'});
  }
  if (!tableName || !tabName || !href) {
    return res.status(400).json({status: 400, message: `tableName=${tableName}, tabName=${tabName}, href=${href}`});
  }

  console.log(`?table=${tableName}&tab=${tabName}&href=${href}`);
  const tableObj = tables.find((table: any) => table.name == tableName);
  if (!tableObj) {
    return res.status(400).json({status: 400, message: `tableObj=${tableObj}`});
  }
  const spreadsheetId = tableObj.spreadsheetId;
  const lineNumberForUpcomingData = await getNextLineNumber({
    spreadsheetId,
    tabName: tabName,
  })
  console.log(`New cell: A${lineNumberForUpcomingData}`);
  try {
    await writeData({
      spreadsheetId,
      tabName,
      data: href,
      lineNumberForUpcomingData,
      res,
    });
    res.send(`A${lineNumberForUpcomingData} has been updated.`);
  } catch(err) {
    console.error(err);
    return res.status(400).json({status: 500, message: err});
  }
});
app.listen(LOCAL_SERVER_PORT, () => {
  console.log(`Listen port ${LOCAL_SERVER_PORT}. You can try to send http://localhost:${LOCAL_SERVER_PORT}/?tableName=${tables[0].name}&tabName=${tables[0].tabs[0]}&href=${encodeURI('https://www.youtube.com/watch?v=sByxI7UX5-g&t=18471s')}`);
});
// server.listen(LOCAL_SERVER_PORT);
// console.log(`Listen port ${LOCAL_SERVER_PORT}. You can try to send http://localhost:${LOCAL_SERVER_PORT}/?tableName=${tables[0].name}&tabName=${tables[0].tabs[0]}&href=${encodeURI('https://www.youtube.com/watch?v=sByxI7UX5-g&t=18471s')}`);

// Number of cell which is still empty. For example, if A1:A108 are filled,
// it will return 109
async function getNextLineNumber({spreadsheetId, tabName}: {spreadsheetId: any, tabName: any}) {
  const range = `'${tabName}'!A1:A1000`;
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  
  let lineNumberForUpcomingData = 1;
  if (result.data.values) {
    lineNumberForUpcomingData = result.data.values.length + 1;
  }
  return lineNumberForUpcomingData;
}

async function writeData({spreadsheetId, tabName, data, lineNumberForUpcomingData, res}: {spreadsheetId: any, tabName: any, data: any, lineNumberForUpcomingData: any, res: any}) {
  const range = `'${tabName}'!A${lineNumberForUpcomingData}:A${lineNumberForUpcomingData}`;
  // https://developers.google.com/sheets/api/reference/rest/v4/ValueInputOption
  // INPUT_VALUE_OPTION_UNSPECIFIED, RAW or USER_ENTERED
  const valueInputOption = 'USER_ENTERED';
  //   values: [
  //     ['A', 'B'],
  //     ['C', 'D'],
  //   ]
  const resource = {
    values: [[data]],
  };

  try {
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
  } catch(err: any) {
    console.error(err);
  }
}