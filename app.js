const http = require("http");
const redis = require("redis");
const express = require("express");
const { error } = require("console");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = redis.createClient();




client.on('error', (err) => {
    console.error('Redis error:', err);
  });
  
  // Function to fetch data from a source (simulated async operation)
  const fetchDataFromSource = async () => {
    return { exampleData: 'This is the fetched data' };
  };
  
  app.get('/data', async (req, res) => {
    await client.connect();
    // const client = redis.createClient({
    //     host:'localhost',
    // port:6379});

    // client.on('error', (err) => console.log('Redis Client Error', err));
      
    // await client.connect();

    const key = 'cached_data';
  
    try {
      // Check if data exists in cache
      client.get(key, async (err, cachedData) => {
        console.log("cached data::::::", cachedData)
        if (err) {
          console.error('Redis error:', err);
          return res.status(500).send('Internal Server Error');
        }
  
        if (cachedData) {
          // Data exists in cache, serve from cache
          return res.json({ data: JSON.parse(cachedData) });
        } else {
          // If data doesn't exist in cache, fetch from database or source
          const data = await fetchDataFromSource();
  
          // Store data in cache for future use
          client.setex(key, 3600, JSON.stringify(data)); // Cache for 1 hour (3600 seconds)
  
          // Send response with fetched data
          return res.json({ data });
        }
      });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });