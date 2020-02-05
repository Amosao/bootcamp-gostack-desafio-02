import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        zip_code: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        street: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;
