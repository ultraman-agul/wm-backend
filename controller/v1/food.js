import FoodModel from "../../models/food.js";
import CategoryModel from "../../models/category.js";
import RestaurantModel from "../../models/restaurant.js";
import BaseClass from "../../prototype/baseClass.js";

class Food extends BaseClass {
  constructor() {
    super();
  }

  //添加食物分类
  addCategory = async (req, res, next) => {
    //category_name 分类名 restaurant_id 餐馆id
    const { category_name, restaurant_id, icon } = req.body;
    if (!category_name || !restaurant_id) {
      res.send({
        status: -1,
        message: "添加食物分类失败,参数有误",
      });
      return;
    }
    const category_id = await this.getId("category_id"); // 插入前获取下一个id
    const category_data = {
      id: category_id,
      name: category_name,
      restaurant_id,
      icon,
      spus: [],
    };
    try {
      const category = await new CategoryModel(category_data).save(); // 插入数据
      console.log(category);
      res.send({
        status: 200,
        message: "添加分类成功",
        category_id,
      });
    } catch (err) {
      console.log("添加分类失败", err);
      res.send({
        status: -1,
        message: "添加分类失败",
      });
    }
  };

  // 根据餐厅id获取餐厅的食品分类
  getCategories = async (req, res, next) => {
    try {
      const { restaurant_id } = req.query;
      const data = await CategoryModel.find({ restaurant_id }, "-_id id name");
      res.send({
        status: 200,
        data,
      });
    } catch (e) {
      res.send({
        status: -1,
        message: e,
      });
    }
  };
}

export default new Food();
