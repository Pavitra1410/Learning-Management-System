import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing authorization token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cognitrace_super_secret_jwt_key_2026_safe_key_99');

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'User account no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired authorization token' });
  }
}

export function roleGuard(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient permissions for this resource' });
    }

    next();
  };
}
