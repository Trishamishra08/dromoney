const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all events
// @route   GET /api/public/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find({ status: { $ne: 'Draft' } });

    // If user is logged in, mark which events they've joined
    let joinedEventIds = [];
    if (req.user) {
        const participations = await EventParticipant.find({ user: req.user.id });
        joinedEventIds = participations.map(p => p.event.toString());
    }

    res.status(200).json({
        success: true,
        count: events.length,
        joinedEvents: joinedEventIds,
        data: events
    });
});

// @desc    Join an event
// @route   POST /api/user/data/events/:id/join
// @access  Private
exports.joinEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new ErrorResponse('Event not found', 404));

    const user = await User.findById(req.user.id);

    // Check if already joined
    const existing = await EventParticipant.findOne({ event: event._id, user: user._id });
    if (existing) return next(new ErrorResponse('Already joined this event', 400));

    // Check coins
    if (user.coins.balance < event.fee) {
        return next(new ErrorResponse('Not enough coins to join', 400));
    }

    // Deduct coins
    user.coins.balance -= event.fee;
    await user.save();

    // Create participant record
    await EventParticipant.create({
        event: event._id,
        user: user._id
    });

    res.status(200).json({
        success: true,
        message: `Successfully joined ${event.title}`
    });
});

// @desc    Submit event result
// @route   POST /api/user/data/events/:id/submit
// @access  Private
exports.submitResult = asyncHandler(async (req, res, next) => {
    const { score, result, prize } = req.body;
    
    const participant = await EventParticipant.findOne({ 
        event: req.params.id, 
        user: req.user.id 
    });

    if (!participant) {
        return next(new ErrorResponse('You must join the event first', 400));
    }

    // Update result
    participant.score = score;
    participant.result = result;
    participant.prize = prize;
    await participant.save();

    res.status(200).json({
        success: true,
        message: 'Result submitted successfully'
    });
});

// @desc    Get single event
// @route   GET /api/public/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Create new event
// @route   POST /api/admin/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.create(req.body);

    res.status(201).json({
        success: true,
        data: event
    });
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
exports.updateEvent = asyncHandler(async (req, res, next) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    await event.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
