const asyncHandler = (fn) => (req, res, next) => {
    if (typeof next !== 'function') console.error('CRITICAL: next is NOT a function in asyncHandler!');
    return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
