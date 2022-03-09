import FoodModel from "../../models/v1/foods";
import CategoryModel from "../../models/v1/category";
import RestaurantModel from "../../models/v1/restaurant";

import BaseClass from "../../prototype/baseClass";

class Foods extends BaseClass {
  constructor() {
    super();
  }

  //添加食物分类
  addCategory = async (req, res, next) => {
    //category_name 餐馆名 restaurant_id 餐馆id
    let { category_name, restaurant_id, icon } = req.body;
    if (!category_name || !restaurant_id) {
      res.send({
        status: -1,
        message: "添加食物分类失败,参数有误",
      });
      return;
    }
    let category_id = await this.getId("category_id");
    let category_data = {
      id: category_id,
      name: category_name,
      restaurant_id,
      icon,
      spus: [],
    };
    try {
      let category = await new CategoryModel(category_data).save();
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
}
