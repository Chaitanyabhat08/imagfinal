const Redis = require('ioredis');

// Create a new Redis client
const redisClient = new Redis();

// Subscribe to a channel
redisClient.subscribe('channelName', (err) => {
  if (err) {
    console.error('Error subscribing to channel:', err);
  } else {
    console.log('Subscribed to channel');
  }
});

// Listen for incoming messages
redisClient.on('message', (channel, message) => {
  console.log(`Received message from channel ${channel}:`, message);
});

// Publish a message to the channel
redisClient.publish('channelName', 'Hello, subscribers!');

// Close the Redis connection
redisClient.quit();
