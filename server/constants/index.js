require('dotenv').config();
let clientUrl = 'http://localhost:5173';

if (process.env.CLIENT_URL) {
  clientUrl = process.env.CLIENT_URL;
} else if (process.env.VERCEL_URL) {
  clientUrl = `https://${process.env.VERCEL_URL}`;
} else if (process.env.NODE_ENV === 'production') {
  clientUrl = 'https://virtuavisage.onrender.com';
}

let apiUrl = 'http://localhost:8080';

if (process.env.API_URL) {
  apiUrl = process.env.API_URL;
} else if (process.env.VERCEL_URL) {
  apiUrl = `https://${process.env.VERCEL_URL}`;
} else if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://virtuavisage-api.onrender.com';
}

module.exports = { clientUrl, apiUrl };
