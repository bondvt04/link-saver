import dotenv from 'dotenv';

const envFile = '.env';// process.env.APP_ENV ? `.env.${process.env.APP_ENV}` : '.env';
dotenv.config({ path: envFile });

export const GOOGLE_URL = process.env.GOOGLE_URL;
export const PROJECT_ID = process.env.PROJECT_ID;
export const PROJECT_NUMBER = process.env.PROJECT_NUMBER;
export const CLIENT_ID = process.env.CLIENT_ID;
export const API_KEY = process.env.API_KEY;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CLIENT_SECRET_FILE_PATH = process.env.CLIENT_SECRET_FILE_PATH;
export const AUTH_URI = process.env.AUTH_URI;
export const TOKEN_URI = process.env.TOKEN_URI;
export const AUTH_PROVIDER_X509_CERT_URL = process.env.AUTH_PROVIDER_X509_CERT_URL;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const JAVASCRIPT_ORIGIN = process.env.JAVASCRIPT_ORIGIN;
export const AUTHORIZATION_CODE = process.env.AUTHORIZATION_CODE;
export const AUTH_URL = process.env.AUTH_URL;
export const SHEETS_SCOPE = process.env.SHEETS_SCOPE;
export const OAUTH_CALLBACK_LEFT = process.env.OAUTH_CALLBACK_LEFT;
export const OAUTH_CALLBACK_PATH = process.env.OAUTH_CALLBACK_PATH;
export const OAUTH_CALLBACK_PORT = process.env.OAUTH_CALLBACK_PORT;
export const GOOGLE_TOKENS_FILE_PATH = process.env.GOOGLE_TOKENS_FILE_PATH;
export const LOCAL_SERVER_PORT = process.env.LOCAL_SERVER_PORT;
