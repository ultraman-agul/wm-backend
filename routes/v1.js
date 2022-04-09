import express from "express";
import Location from "../controller/v1/location.js";
import Restaurant from "../controller/v1/restaurant.js";
import Foods from "../controller/v1/food.js";
import Order from "../controller/v1/order.js";
import Comment from "../controller/v1/comment.js";
const router = express.Router();
// 位置
router.get("/location", Location.location); // 获取当前位置
router.get("/location_search", Location.locationSearch); // 返回多个搜索地址结果，用于搜索建议
// 餐厅
router.get("/all_restaurant", Restaurant.allRestaurant); // 获取所有餐厅
router.get("/searchRestaurant", Restaurant.searchRestaurant); // 获取所有餐厅
router.get("/restaurant/:id", Restaurant.getRestaurantById); // 根据id获取餐厅信息
router.get("/allRestaurantNoLoc", Restaurant.allRestaurantNoLoc);
router.get("/hasShop", Restaurant.getHasShop); // 判断用户是否拥有商店
router.post("/createShop", Restaurant.createShop); // 创建商店
router.get("/getShopInfo", Restaurant.getShopInfo); // 获取商店信息
router.get("/updateActivities", Restaurant.updateActivities); // 更新活动列表
router.post("/updateShop", Restaurant.updateShop); // 更新活动列表
// 分类，食物
router.post("/add_category", Foods.addCategory); // 餐厅添加食品分类
router.get("/get_categories", Foods.getCategories); // 获取餐厅的食品分类
router.post("/deleteCategory", Foods.deleteCategory); // 根据分类id删除食品分类
router.post("/addFood", Foods.addFood); // 添加食品
router.post("/setFood", Foods.setFood); // 修改食品信息
router.get("/getFoods", Foods.getFoods);
router.get("/deleteFood", Foods.deleteFood);
// 订单
router.post("/order", Order.makeOrder); // 提交订单,生成订单
router.get("/getOrder", Order.getOrder); // 获取用户的订单, 可以分页
router.get("/orderInfo", Order.orderInfo); // 获取订单详细信息
router.get("/getOrderByRestaurantId", Order.getOrderByRestaurantId); // 获取商家的所有订单
router.get("/getTodayOrderByRestaurantId", Order.getTodayOrderByRestaurantId); // 获取商家的今日订单
router.get("/orderGroupByDay", Order.orderGroupByDay); // 统计每天的订单数量
// 评价
router.post("/makeComment", Comment.makeComment); // 获取订单详细信息
router.get("/restaurantComment", Comment.restaurantComment); // 获取商家评论
router.get("/replyComment", Comment.replyComment);
export default router;
