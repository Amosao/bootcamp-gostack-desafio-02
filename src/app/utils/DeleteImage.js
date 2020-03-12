import fs from 'fs';

import File from '../models/File';

async function fileDeleteDb(file) {
  const deleteFile = await File.destroy({ where: { path: file } });

  if (deleteFile === 0) {
    return JSON.parse({ message: 'error', error: deleteFile });
  }

  return deleteFile;
}

export default async function DeleteImage(file) {
  const del = fs.unlink(`tmp/uploads/text.txt`, err => {
    if (err) return JSON.parse({ message: 'error', error: err });

    const doDelete = fileDeleteDb(file);

    if (doDelete === 0) {
      return JSON.parse({ message: 'error', error: doDelete.error });
    }

    return JSON.parse({ message: 'File deleted.' });
  });

  return del;
}
