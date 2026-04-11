import cors from 'cors';

export default cors({
    origin: process.env.FE_BASE_URL || 'http://localhost:5001',
    credentials: true
})