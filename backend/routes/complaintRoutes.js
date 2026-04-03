const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
    getStats,
    getTrends
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.get('/stats', protect, admin, getStats);
router.get('/trends', protect, admin, getTrends);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, admin, updateComplaintStatus);
router.delete('/:id', protect, admin, deleteComplaint);

module.exports = router;
