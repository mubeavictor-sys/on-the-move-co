const express = require('express');
const router = express.Router();
const { 
    createErrand, 
    getAvailableErrands, 
    acceptErrand, 
    updateErrandStatus, 
    getMyErrands, 
    getAvailableBatches, 
    acceptBatch,
    updateErrandLocation,
    submitCompletion,
    confirmReceipt
} = require('../controllers/errandController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.post('/', auth, authorize('customer'), createErrand);
router.get('/available', auth, authorize('runner', 'admin'), getAvailableErrands);
router.get('/batches', auth, authorize('runner'), getAvailableBatches);
router.post('/batches/:id/accept', auth, authorize('runner'), acceptBatch);
router.get('/my', auth, getMyErrands);
router.post('/:id/accept', auth, authorize('runner'), acceptErrand);
router.patch('/:id/status', auth, authorize('runner'), updateErrandStatus);
router.patch('/:id/location', auth, authorize('runner'), updateErrandLocation);
router.post('/:id/submit-completion', auth, authorize('runner'), submitCompletion);
router.post('/:id/confirm-receipt', auth, authorize('customer'), confirmReceipt);

module.exports = router;
