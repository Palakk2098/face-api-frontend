import axios from 'axios';

const API_BASE_URL =
  'https://face-api-backend-xjaw-cqo0ww42o-palakk2098s-projects.vercel.app/api';
// const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
