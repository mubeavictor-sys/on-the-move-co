const redis = require('../config/redis');
const db = require('../config/db');

const updateRunnerLocation = async (runnerId, lat, long) => {
  try {
    // Update Redis for real-time tracking (cache)
    await redis.set(`runner:${runnerId}:location`, JSON.stringify({ lat, long, timestamp: Date.now() }));
    
    // Periodically update PostgreSQL for persistence (optional, but good for logs/analytics)
    await db.query(
      'UPDATE runners SET current_location_lat = $1, current_location_long = $2, last_active = CURRENT_TIMESTAMP WHERE user_id = $3',
      [lat, long, runnerId]
    );
  } catch (error) {
    console.error('Error updating runner location:', error);
  }
};

const getRunnerLocation = async (runnerId) => {
  try {
    const location = await redis.get(`runner:${runnerId}:location`);
    return location ? JSON.parse(location) : null;
  } catch (error) {
    console.error('Error getting runner location:', error);
    return null;
  }
};

module.exports = {
  updateRunnerLocation,
  getRunnerLocation,
};
