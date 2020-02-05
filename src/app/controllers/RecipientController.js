import * as yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  // GET ALL RECIPIENTS DATA
  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  // GET 1 RECIPIENTS DATA
  async show(req, res) {
    return res.json();
  }

  // CREATE RECIPIENT
  async store(req, res) {
    const schema = yup.object().shape({
      zip_code: yup.string(),
      state: yup.string().required(),
      number: yup.string().required(),
      complement: yup.string(),
      city: yup.string().required(),
      street: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  // UPDATE RECIPIENT DATA
  async update(req, res) {
    const schema = yup.object().shape({
      zip_code: yup.string(),
      state: yup.string(),
      number: yup.string(),
      complement: yup.string(),
      city: yup.string(),
      street: yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    try {
      const {
        id,
        zip_code,
        number,
        street,
        city,
        state,
        compliment,
      } = recipient.update(req.body);

      return res.json({
        id,
        zip_code,
        number,
        street,
        city,
        state,
        compliment,
      });
    } catch (err) {
      return res.json();
    }
  }

  // DEACTIVATE RECIPIENT
  async delete(req, res) {
    return res.json();
  }
}

export default new RecipientController();
