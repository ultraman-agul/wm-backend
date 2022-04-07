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

  // 删除分类
  async deleteCategory(req, res, next) {
    let { category_id } = req.body;
    try {
      await CategoryModel.remove({ id: category_id });
      res.send({
        status: 200,
        message: "删除成功",
      });
    } catch (err) {
      console.log("删除出错");
      res.send({
        status: -1,
        message: "删除出错",
      });
    }
  }

  //添加食物  传入食物分类名， 如果没有该分类则添加分类，如果有，则不添加
  addFood = async (req, res, next) => {
    const {
      restaurant_id,
      category,
      name,
      min_price,
      description,
      pic_url,
      detailDescription,
      price,
    } = req.body;
    if (!category || !name) {
      res.send({
        status: -1,
        message: "添加食物失败，参数有误!",
      });
      return;
    }
    try {
      const cateObj = await CategoryModel.findOne({ name: category }, "id");
      let category_id = cateObj ? cateObj.id : null;
      console.log(category_id);
      if (!category_id) {
        category_id = await this.getId("category_id"); // 插入前获取下一个id
        const category_data = {
          id: category_id,
          name: category,
          restaurant_id,
          spus: [],
        };
        await new CategoryModel(category_data).save(); // 插入数据
      }
      const skus = [
        {
          description: detailDescription,
          price,
        },
      ];
      for (let i = 0; i < skus.length; i++) {
        let sku_id = await this.getId("sku_id");
        skus[i]["id"] = sku_id;
      }
      const month_saled = Math.ceil(Math.random() * 50); //随机生成一个月售数量
      const food_id = await this.getId("food_id"); // 获取最新的food id
      const food_data = {
        id: food_id,
        restaurant_id,
        category_id,
        name,
        praise_num: Math.ceil(Math.random() * 50), //点赞数量
        month_saled,
        month_saled_content: `${month_saled}`,
        min_price,
        description,
        pic_url,
        skus,
      };
      const addFoods = await new FoodModel(food_data).save(); // 插入数据到食品表
      console.log(addFoods);
      const categoryObj = await CategoryModel.findOne({ id: category_id }); // 根据类型id找到类型表
      const updateCategory = categoryObj.spus.push(addFoods._id); // 添加食品id到分类表中的某个分类
      await categoryObj.save(); // 保存分类表
      res.send({
        status: 200,
        message: "添加食物成功",
        food_id,
      });
    } catch (err) {
      console.log("添加食物失败", err);
      res.send({
        status: -1,
        message: "添加食物失败",
      });
    }
  };

  //获取食物列表
  getFoods = async (req, res, next) => {
    const { restaurant_id } = req.query;
    if (!restaurant_id) {
      res.send({
        status: -1,
        message: "获取食物失败，参数有误",
      });
      return;
    }
    try {
      // 在定义Schema的时候，如果设置某个 field 关联另一个Schema，那么在获取 document 的时候就可以使用 Population 功能通过关联Schema的 field 找到关联的另一个 document，并且用被关联 document 的内容替换掉原来关联字段(field)的内容。
      let foods = await CategoryModel.find({ restaurant_id }, "-_id").populate({
        path: "spus",
      });
      res.send({
        status: 200,
        message: "获取食物列表成功",
        data: foods,
      });
    } catch (err) {
      console.log("获取餐馆食物失败", err);
      res.send({
        status: -1,
        message: "获取餐馆食物失败",
      });
    }
  };

  // 修改食物信息
  setFood = async (req, res, next) => {
    const {
      restaurant_id,
      category,
      name,
      min_price,
      description,
      pic_url,
      detailDescription,
      price,
      food_id,
    } = req.body;
    try {
      const cateObj = await CategoryModel.findOne({ name: category }, "id");
      let category_id = cateObj ? cateObj.id : null;
      console.log(category_id);
      if (!category_id) {
        category_id = await this.getId("category_id"); // 插入前获取下一个id
        const category_data = {
          id: category_id,
          name: category,
          restaurant_id,
          spus: [],
        };
        await new CategoryModel(category_data).save(); // 插入数据
      }
      const skus = [
        {
          description: detailDescription,
          price,
        },
      ];
      const food_data = {
        category_id,
        name,
        min_price,
        description,
        pic_url,
        skus,
      };
      const updateFood = await FoodModel.updateOne({ id: food_id }, food_data); // 插入数据到食品表
      console.log(updateFood);
      const categoryObj = await CategoryModel.findOne({ id: category_id }); // 根据类型id找到类型表
      if (categoryObj.spus.indexOf(updateFood._id) == -1) {
        categoryObj.spus.push(updateFood._id); // 添加食品id到分类表中的某个分类
        await categoryObj.save(); // 保存分类表
      }
      res.send({
        status: 200,
        message: "修改食物成功",
        food_id,
      });
    } catch (err) {
      console.log("修改食物失败", err);
      res.send({
        status: -1,
        message: "修改食物失败",
      });
    }
  };
}

export default new Food();
