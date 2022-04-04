import express from "express";
import Upload from "../controller/upload/upload.js";

const router = express.Router();
router.post("/upload", Upload.upload); // 上传图片
router.post("/uploadFoodPic", Upload.uploadFoodPic);
router.post("/uploadCommentPic", Upload.uploadCommentPic);
router.post("/uploadShopAvatar", Upload.uploadShopAvatar);
export default router;
