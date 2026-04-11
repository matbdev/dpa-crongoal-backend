import rateLimit from 'express-rate-limit';

export default rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});