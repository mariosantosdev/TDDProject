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
        resolve(`uploads/${filename}`);
      });
    } catch (error) {
      reject(error);
    }
  });
}

class UploadController {
  async upload(req, res) {
    try {
      const path = await writeFileInFolder(req.file);

      const image = new UploadModel({ userId: req.userId, link: path });
      image.save();

      res.status(200).json({ image });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

module.exports = new UploadController();
