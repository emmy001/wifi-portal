// Load environment variables from .env file
require('dotenv').config();

// Your API username and password from the .env file
const apiUsername = process.env.API_USERNAME;
const apiPassword = process.env.API_PASSWORD;

// Concatenating username and password with colon
const credentials = `${apiUsername}:${apiPassword}`;

// Base64 encode the credentials
const encodedCredentials = Buffer.from(credentials).toString('base64'); // For Node.js
// const encodedCredentials = btoa(credentials); // For browser

// Creating the Basic Auth token
const basicAuthToken = `Basic ${encodedCredentials}`;

// Output the token
console.log(basicAuthToken);
