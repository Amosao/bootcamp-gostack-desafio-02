import User from '../models/User';
import Courier from '../models/Courier';

import UploadImage from '../utils/UploadImage';

class ProfilePictureController {
  async store(req, res) {
    const { profile, id } = req.params;

    let model;

    switch (profile) {
      case 'user':
        model = User;
        break;

      case 'courier':
        model = Courier;
        break;

      default:
        model = User;
    }

    const save = await model.sequelize.transaction();

    try {
      const user = await model.findByPk(id);

      const file = await UploadImage(req.file);

      if (file.error) {
        return res.status(500).json(file);
      }

      const { avatar_id } = await user.update({ avatar_id: file.id });

      if (!avatar_id) {
        return res
          .status(500)
          .json({ error: 'File could not be saved as profile picture' });
      }

      save.commit();

      return res.json({ message: 'Foto de perfil atualizada.', id: avatar_id });
    } catch (err) {
      save.rollback();

      return res.json({ error: err });
    }
  }
}

export default new ProfilePictureController();
