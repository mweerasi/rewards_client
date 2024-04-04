import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/', // Django backend URL
});

export default instance;