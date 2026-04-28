import rateLimit from 'express-rate-limit'
export const authLimiter = rateLimit({
    windowMs:15*60*1000,
    max:10,
    message:{success:false,message:"Too many attemt.Try again in 15 minute"},
    standardHeaders: true,
    legacyHeaders: false,
})
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { success: false, message: "Too many requests. Slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});