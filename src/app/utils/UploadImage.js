import File from '../models/File';

export default async function UploadImage(file) {
  const { originalname: name, filename: path } = file;

  const transaction = File.sequelize.transaction();

  try {
    const upload = await File.create({
      name,
      path,
    });

    if (upload) {
      return upload;
    }

    transaction.commit();
  } catch (err) {
    transaction.rollback();

    return {
      message: 'File could not be uploaded.',
      error: err,
    };
  }
}
