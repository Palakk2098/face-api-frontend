import axios from 'axios';

const API_BASE_URL =
  'https://face-api-backend-3wf86n0wc-palakk2098s-projects.vercel.app/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
