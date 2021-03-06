import Busboy from "busboy";
import fs from "fs";
import path from "path";
import BaseClass from "../../prototype/baseClass.js";

class Upload extends BaseClass {
  constructor() {
    super();
  }

  // 用户头像上传
  upload(req, res) {
    const __dirname = path.resolve();
    const busboy = new Busboy({ headers: req.headers });
    let visitUrl;
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const saveTo = path.join(__dirname, "public/uploads", filename);
      // __dirname获取的是项目的根路径，而不是当前文件的路径！ 所以此处是根目录下的public/uploads
      visitUrl = "/uploads/" + filename;
      file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on("finish", function () {
      res.send({
        status: 200,
        url: visitUrl,
        message: "文件上传成功",
      });
    });

    return req.pipe(busboy);
  }

  // 食品图片上传
  uploadFoodPic(req, res) {
    const __dirname = path.resolve();
    const busboy = new Busboy({ headers: req.headers });
    let visitUrl;
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const saveTo = path.join(__dirname, "public/foods", filename);
      // __dirname获取的是项目的根路径，而不是当前文件的路径！ 所以此处是根目录下的public/foods
      visitUrl = "/foods/" + filename;
      file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on("finish", function () {
      res.send({
        status: 200,
        url: visitUrl,
        message: "文件上传成功",
      });
    });

    return req.pipe(busboy);
  }

  // 评价图片上传
  uploadCommentPic(req, res) {
    const __dirname = path.resolve();
    const busboy = new Busboy({ headers: req.headers });
    let visitUrl;
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const saveTo = path.join(__dirname, "public/commentPic", filename);
      // __dirname获取的是项目的根路径，而不是当前文件的路径！ 所以此处是根目录下的public/commentPic
      visitUrl = "/commentPic/" + filename;
      console.log(visitUrl);
      file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on("finish", function () {
      res.send({
        status: 200,
        url: visitUrl,
        message: "文件上传成功",
      });
    });

    return req.pipe(busboy);
  }

  // 商店头像上传
  uploadShopAvatar(req, res) {
    const __dirname = path.resolve();
    const busboy = new Busboy({ headers: req.headers });
    let visitUrl;
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const saveTo = path.join(__dirname, "public/shopAvatar", filename);
      // __dirname获取的是项目的根路径，而不是当前文件的路径！ 所以此处是根目录下的public/uploads
      visitUrl = "/shopAvatar/" + filename;
      file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on("finish", function () {
      res.send({
        status: 200,
        url: visitUrl,
        message: "文件上传成功",
      });
    });

    return req.pipe(busboy);
  }
}
export default new Upload();
