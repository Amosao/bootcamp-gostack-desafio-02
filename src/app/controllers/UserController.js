import * as yup from 'yup';

import User from '../models/User';
import File from '../models/File';

import UploadImage from '../utils/UploadImage';
import DeleteImage from '../utils/DeleteImage';

class UserController {
  // GET ALL USERS DATA
  async index(req, res) {
    const users = await User.findAll({
      include: [{ model: File, as: 'avatar', attributes: ['path', 'url'] }],
      attributes: {
        exclude: ['password_hash', 'updatedAt'],
      },
    });

    return res.json(users);
  }

  // GET 1 USER DATA
  async show(req, res) {
    if (req.params.id) {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
        ],
      });

      if (!user) {
        return res.status(401).json({ error: 'User does not exist.' });
      }

      const { name, email, provider, avatar, createdAt } = user;

      return res.json({
        name,
        email,
        provider,
        avatar_url: avatar.url,
        createdAt,
      });
    }

    const user = await User.findByPk(req.userId, {
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User does not exist.' });
    }

    const {
      name,
      email,
      password_hash,
      provider,
      avatar,
      createdAt,
      updatedAt,
    } = user;

    return res.json({
      name,
      email,
      password_hash,
      provider,
      avatar_url: avatar.url,
      createdAt,
      updatedAt,
    });
  }

  // CREATE USER
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .required()
        .min(6),
    });

    let body = JSON.parse(req.body.body);

    if (!(await schema.isValid(body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const userExists = await User.findOne({
      where: {
        email: body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const transaction = await User.sequelize.transaction();

    if (req.file) {
      const file = await UploadImage(req.file);

      if (file.error) {
        return res.status(500).json(file);
      }

      body = { ...body, avatar_id: file.id };
    }

    try {
      const { id, name, email, provider } = await User.create(body);
      transaction.commit();

      return res.json({ id, name, email, provider });
    } catch (err) {
      transaction.rollback();
      await DeleteImage(body.avatar_id);

      return res.status(500).json({ message: 'error', error: err });
    }
  }

  // UPDATE USER DATA
  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      old_password: yup
        .string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      password: yup.string().min(6),
      confirm_password: yup
        .string()
        .when('password', (password, field) =>
          password ? field.required().oneOf([yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { email, old_password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email already registered.' });
      }
    }

    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const transaction = await User.sequelize.transaction();

    try {
      const { id, name, provider } = await user.update(req.body);

      transaction.commit();

      return res.json({ id, name, email, provider });
    } catch (err) {
      transaction.rollback();

      return res.status(500).json({ message: 'error', error: err });
    }
  }

  // DEACTIVATE USER
  async delete(req, res) {
    const deleteFile = await DeleteImage(
      '55b724d7d2a30577db153e75fdb52eba.jpg'
    );

    return res.json(deleteFile);
  }
}

export default new UserController();
