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

        constByCategory = await Complaint.aggregate([
            { $group: { _id: '$category', value: { $count: {} } } },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        res.json({
            total,
            pending,
            resolved,
            byCategory: constByCategory
        });
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
    getStats
};
