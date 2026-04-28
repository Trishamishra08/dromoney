const BusinessIdea = require('../models/BusinessIdea');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all business ideas for users
// @route   GET /api/public/business-ideas
// @access  Public (Partial) / Private (User)
exports.getBusinessIdeas = async (req, res, next) => {
    try {
        const ideas = await BusinessIdea.find({ isActive: true }).sort('createdAt');
        
        let unlockedIds = [];
        if (req.user) {
            const user = await User.findById(req.user.id);
            unlockedIds = user.unlockedIdeas.map(id => id.toString());
        }

        const data = ideas.map(idea => {
            const isPremium = idea.type === 'Premium';
            const isUnlocked = !isPremium || unlockedIds.includes(idea._id.toString());
            
            return {
                _id: idea._id,
                title: idea.title,
                desc: idea.desc,
                potential: idea.potential,
                icon: idea.icon,
                color: idea.color,
                bg: idea.bg,
                type: idea.type,
                price: idea.price,
                steps: isUnlocked ? idea.steps : [], // Hide steps if locked
                youtubeLink: isUnlocked ? idea.youtubeLink : '', // Hide link if locked
                isLocked: !isUnlocked
            };
        });

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Unlock a premium business idea
// @route   POST /api/user/business-ideas/unlock
// @access  Private
exports.unlockIdea = async (req, res, next) => {
    try {
        const { ideaId } = req.body;
        const idea = await BusinessIdea.findById(ideaId);

        if (!idea) {
            return next(new ErrorResponse('Idea not found', 404));
        }

        const user = await User.findById(req.user.id);
        
        if (user.unlockedIdeas.includes(ideaId)) {
            return next(new ErrorResponse('Idea already unlocked', 400));
        }

        if (user.wallet.balance < idea.price) {
            return next(new ErrorResponse('Insufficient balance to unlock this strategy', 400));
        }

        // Deduct balance and unlock
        user.wallet.balance -= idea.price;
        user.unlockedIdeas.push(ideaId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Strategy unlocked successfully',
            data: { balance: user.wallet.balance }
        });
    } catch (err) {
        next(err);
    }
};

// --- ADMIN CONTROLLERS ---

// @desc    Get all business ideas for Admin
// @route   GET /api/admin/business-ideas
// @access  Private/Admin
exports.adminGetBusinessIdeas = async (req, res, next) => {
    try {
        const ideas = await BusinessIdea.find().sort('-createdAt');
        res.status(200).json({
            success: true,
            data: ideas
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new business idea
// @route   POST /api/admin/business-ideas
// @access  Private/Admin
exports.createBusinessIdea = async (req, res, next) => {
    try {
        const idea = await BusinessIdea.create(req.body);
        res.status(201).json({
            success: true,
            data: idea
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update business idea
// @route   PUT /api/admin/business-ideas/:id
// @access  Private/Admin
exports.updateBusinessIdea = async (req, res, next) => {
    try {
        const idea = await BusinessIdea.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!idea) {
            return next(new ErrorResponse('Idea not found', 404));
        }

        res.status(200).json({
            success: true,
            data: idea
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete business idea
// @route   DELETE /api/admin/business-ideas/:id
// @access  Private/Admin
exports.deleteBusinessIdea = async (req, res, next) => {
    try {
        const idea = await BusinessIdea.findById(req.params.id);

        if (!idea) {
            return next(new ErrorResponse('Idea not found', 404));
        }

        await idea.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
