import express from "express";
import Pay from "../controller/admin/alipay.js";

const router = express.Router();
router.post("/pay", Pay.alipay);
router.get("/successPay", Pay.successPay);
export default router;
