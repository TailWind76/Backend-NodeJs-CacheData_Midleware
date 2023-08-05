// Connecting to Redis
const redis = require('redis');
const client = redis.createClient();

// Caching Middleware
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.url;
  client.get(cacheKey, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        client.setex(cacheKey, 3600, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  });
};

// Using Caching Middleware
app.get('/api/data', cacheMiddleware, (req, res) => {
  // Your data processing code here
  const data = { message: 'This is cached data!' };
  res.send(data);
});
