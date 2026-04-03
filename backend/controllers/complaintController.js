const Complaint = require('../models/Complaint');
const { analyzeComplaint } = require('../services/aiService');

// @desc    Create new complaint with AI analysis
// @route   POST /api/complaints
// @access  Public
const createComplaint = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Complaint text is required' });
    }

    try {
        // AI Analysis
        const analysis = await analyzeComplaint(text);

        const complaint = new Complaint({
            user: req.user._id,
            text,
            category: analysis.category,
            sentiment: analysis.sentiment,
            priority: analysis.priority,
            response: analysis.response,
            status: 'pending'
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
    try {
        let query = {};
        if (!req.user.isAdmin) {
            query = { user: req.user._id };
        }
        const complaints = await Complaint.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private/Admin
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            res.json(complaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            complaint.status = req.body.status || complaint.status;
            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            await complaint.deleteOne();
            res.json({ message: 'Complaint removed' });
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complaint stats
// @route   GET /api/complaints/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const total = await Complaint.countDocuments({});
        const pending = await Complaint.countDocuments({ status: 'pending' });
        const resolved = await Complaint.countDocuments({ status: 'resolved' });

        const byCategory = await Complaint.aggregate([
            { $group: { _id: '$category', value: { $count: {} } } },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        res.json({
            total,
            pending,
            resolved,
            byCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get 7-day complaint trend (complaints per day)
// @route   GET /api/complaints/trends
// @access  Private/Admin
const getTrends = async (req, res) => {
    try {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const results = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    complaints: { $sum: 1 }
                }
            }
        ]);

        const trendMap = {};
        results.forEach(r => { trendMap[r._id] = r.complaints; });

        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayOfWeek = d.getDay() + 1; // MongoDB $dayOfWeek: 1=Sun, 7=Sat
            trend.push({ name: days[d.getDay()], complaints: trendMap[dayOfWeek] || 0 });
        }

        res.json(trend);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
    getStats,
    getTrends
};
