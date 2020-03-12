import Recipient from '../models/Recipient';

export default async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (recipient) {
      return next();
    }

    return res
      .status(401)
      .json({ error: 'Requested recipient does not exist.' });
  } catch (err) {
    return res.status(401).json(err);
  }
};
