const config = {
  API_BASE: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000',
  UPLOAD_ENDPOINT: import.meta.env.VITE_UPLOAD_ENDPOINT || '/upload',
};

export default config;
