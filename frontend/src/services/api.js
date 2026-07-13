const axios = require('axios');

const API = axios.create({ baseURL: process.env.BACKEND_URL || 'http://localhost:4000/api' });

module.exports = API;
