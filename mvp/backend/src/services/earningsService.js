const db = require('../config/db');

const processRunnerEarnings = async (errandId) => {
  try {
    const errandResult = await db.query('SELECT runner_id, estimated_price FROM errands WHERE id = $1', [errandId]);
    const errand = errandResult.rows[0];

    if (!errand.runner_id) return;

    const runnerShare = parseFloat(errand.estimated_price) * 0.85; // Runner gets 85%

    await db.query(
      'INSERT INTO runner_earnings (runner_id, errand_id, amount) VALUES ($1, $2, $3)',
      [errand.runner_id, errandId, runnerShare]
    );

    console.log(`Earnings processed for runner: ${errand.runner_id}`);
  } catch (error) {
    console.error('Earnings Processing Error:', error);
  }
};

module.exports = {
  processRunnerEarnings,
};
