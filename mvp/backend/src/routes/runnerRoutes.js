const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/status', auth, authorize('admin'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.full_name, u.phone,
                   CASE WHEN r.last_active < NOW() - INTERVAL '2 minutes' THEN true ELSE false END as is_silent
            FROM runners r
            JOIN users u ON r.user_id = u.id
            WHERE r.status = 'busy'
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
