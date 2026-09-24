import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Too many authentication attempts. Please try again later.' },
});

export const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Submission rate limit exceeded (max 10 submissions/min).' },
});

export const vivaLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Viva rate limit exceeded.' },
});
