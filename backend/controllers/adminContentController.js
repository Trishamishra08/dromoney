const Task = require('../models/Task');
const Ad = require('../models/Ad');
const BusinessIdea = require('../models/BusinessIdea');
const ErrorResponse = require('../utils/errorResponse');

// --- TASKS ---
exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (err) { next(err); }
};

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find().sort('-createdAt');
        res.status(200).json({ success: true, data: tasks });
    } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!task) return next(new ErrorResponse('Task not found', 404));
        res.status(200).json({ success: true, data: task });
    } catch (err) { next(err); }
};

// --- ADS ---
exports.createAd = async (req, res, next) => {
    try {
        const ad = await Ad.create(req.body);
        res.status(201).json({ success: true, data: ad });
    } catch (err) { next(err); }
};

exports.getAds = async (req, res, next) => {
    try {
        const ads = await Ad.find().sort('-createdAt');
        res.status(200).json({ success: true, data: ads });
    } catch (err) { next(err); }
};

exports.updateAd = async (req, res, next) => {
    try {
        const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ad) return next(new ErrorResponse('Ad not found', 404));
        res.status(200).json({ success: true, data: ad });
    } catch (err) { next(err); }
};

// --- BUSINESS IDEAS ---
exports.createBusinessIdea = async (req, res, next) => {
    try {
        const idea = await BusinessIdea.create(req.body);
        res.status(201).json({ success: true, data: idea });
    } catch (err) { next(err); }
};

exports.getBusinessIdeas = async (req, res, next) => {
    try {
        const ideas = await BusinessIdea.find().sort('-createdAt');
        res.status(200).json({ success: true, data: ideas });
    } catch (err) { next(err); }
};

// Generic Delete
exports.deleteContent = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        let model;
        if (type === 'task') model = Task;
        else if (type === 'ad') model = Ad;
        else if (type === 'business') model = BusinessIdea;

        if (!model) return next(new ErrorResponse('Invalid content type', 400));
        
        await model.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) { next(err); }
};
