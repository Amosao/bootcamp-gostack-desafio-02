import User from '../models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token not provided.' });
  }

  const user = await User.findByPk(req.userId);

  if (!user.provider) {
    return res.status(401).json({ error: 'User must be a provider' });
  }

  return next();
};
