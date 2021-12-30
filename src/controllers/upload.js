const path = require("path");
const fs = require("fs");
const UploadModel = require("../db/Upload");

function writeFileInFolder(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const { buffer, originalname } = file;

      const DestinationFolder = path.resolve(__dirname, "..", "..", "uploads");

      fs.mkdir(DestinationFolder, { recursive: true }, (err) => {
        if (err) reject(err);

        const filename = Date.now() + "_" + originalname;
        const path = `${DestinationFolder}/${filename}`;
        fs.writeFileSync(path, buffer);
        resolve(filename);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function deleteFileInFolder(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const DestinationFolder = path.resolve(__dirname, "..", "..", "uploads");

      if (!fs.existsSync(`${DestinationFolder}/${filename}`)) {
        reject("File don't found.");
      }

      fs.unlinkSync(`${DestinationFolder}/${filename}`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

class UploadController {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ messageError: "File is missing." });
      }

      const filename = await writeFileInFolder(req.file);

      const image = new UploadModel({
        userId: req.userId,
        link: `uploads/${filename}`,
        filename,
      });
      image.save();

      res.status(200).json({ image });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  async delete(req, res) {
    try {
      const file = await UploadModel.findByIdAndRemove(req.params.id, {
        new: true,
      });
      await deleteFileInFolder(file.filename);

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

module.exports = new UploadController();
