import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // MANDATORY: This allows cookies to be sent/received
});

// no request interceptor for the Authorization header!
// The browser handles the 'jwt' cookie automatically.

export default api;