const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3001/users/me',
  'https://api.filmsearch.nomoredomains.xyz',
  'http://api.filmsearch.nomoredomains.xyz',
  'https://filmsearch.nomoredomains.xyz',
  'http://filmsearch.nomoredomains.xyz',
];

module.exports = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }

  next();
});
