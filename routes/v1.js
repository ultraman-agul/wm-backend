import express from "express";
import Location from "../controller/v1/location.js";
import Restaurant from "../controller/v1/restaurant.js";
import Foods from "../controller/v1/food.js";

const router = express.Router();

router.get("/location", Location.location); // 获取当前位置
router.get("/location_search", Location.locationSearch); // 返回多个搜索地址结果，用于搜索建议

router.get("/all_restaurant", Restaurant.allRestaurant); // 获取所有餐厅
router.get("/restaurant/:id", Restaurant.getRestaurantById); // 根据id获取餐厅信息

router.post("/add_category", Foods.addCategory); // 餐厅添加食品分类

export default router;
