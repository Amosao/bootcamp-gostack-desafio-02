import * as yup from 'yup';

import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async index(req, res) {
    const couriers = await Courier.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(couriers);
  }

  // async show(req, res) {}

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const courierExists = await Courier.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (courierExists) {
      return res.status(400).json({ error: 'Courier already exists.' });
    }

    const transaction = await Courier.sequelize.transaction();

    try {
      const { id, name, email } = await Courier.create(req.body);

      transaction.commit();

      return res.json({ id, name, email });
    } catch (err) {
      transaction.rollback();

      return res.status(500).json({ message: 'error', error: err });
    }
  }

  // async update(req, res) {}

  // async delete(req, res) {}
}

export default new CourierController();
