import BaseClass from "../../prototype/baseClass.js";
import AdminModel from "../../models/admin.js";
import OrderModel from "../../models/order.js";
import CommentModel from "../../models/comment.js";

class Comment extends BaseClass {
  constructor() {
    super();
  }

  //评论
  makeComment = async (req, res, next) => {
    console.log(req.body);
    let {
      order_id,
      comment_data,
      food_score = 0,
      delivery_score = 0,
      quality_score = 0,
      pic_url = [],
    } = req.body;
    if (!order_id || !comment_data) {
      res.send({
        status: -1,
        message: "评论失败，参数有误",
      });
      return;
    }
    try {
      let order = await OrderModel.findOne({ id: order_id }).populate([
        { path: "restaurant" },
        { path: "user_id" },
      ]);
      console.log(order);
      //判断订单能否评价
      let user = await AdminModel.findOne({ id: order.user_id.id });
      let user_id = req.user.user_id;
      //   if (user.id !== user_id || order.code !== 200) { // 本应该没支付不能评价，支付后code改成200
      if (user.id !== user_id) {
        //  暂时让用户如果是本人就可以评价
        // 比较当前是否为订单用户，并且还没评价过
        res.send({
          status: -1,
          message: "评价失败，该订单不能评论!",
        });
        return;
      }
      console.log("user", user);
      let comment_id = await this.getId("comment_id");
      let data = {
        user_id,
        id: comment_id,
        user_name: user.username,
        avatar: user.avatar,
        restaurant_id: order.restaurant.id,
        restaurant: order.restaurant._id,
        pic_url: pic_url,
        comment_data,
        order_id,
        food_score,
        delivery_score,
      };
      console.log("data", data);
      let comment = await new CommentModel(data).save();
      /*修改商品评分begin*/
      let restaurant = order.restaurant;
      let comment_number = restaurant.comment_number;
      restaurant.wm_poi_score = (
        (restaurant.wm_poi_score * comment_number + food_score) /
        (comment_number + 1)
      ).toFixed(1);
      restaurant.delivery_score = (
        (restaurant.delivery_score * comment_number + delivery_score) /
        (comment_number + 1)
      ).toFixed(1);
      restaurant.comment_number++;
      await restaurant.save();
      /*修改商品评分end*/
      /* order.has_comment =  !order.has_comment;
       await order.save();*/
      await OrderModel.updateOne({ id: order_id }, { has_comment: true }); // 更新订单为评价过了
      res.send({
        status: 200,
        message: "评论成功",
      });
    } catch (err) {
      console.log("评论失败", err);
      res.send({
        status: -1,
        message: "评论失败",
      });
    }
  };

  restaurantComment = async (req, res, next) => {
    let { restaurant_id, offset = 0, limit = 5 } = req.query;
    if (!restaurant_id) {
      res.send({
        status: -1,
        message: "获取餐馆评论失败，参数有误！",
      });
      return;
    }
    try {
      let comments = await CommentModel.find({ restaurant_id }, "-_id")
        .skip(offset * limit)
        .limit(Number(limit))
        .sort({ comment_time: -1 });
      let allData = await CommentModel.find({ restaurant_id }, "-_id");
      res.send({
        status: 200,
        message: "获取餐馆评论成功",
        totalNum: allData.length,
        data: comments,
      });
    } catch (err) {
      console.log("获取餐馆评论失败", err);
      res.send({
        status: -1,
        message: "获取餐馆评论失败",
      });
    }
  };

  replyComment = async (req, res, next) => {
    const { id, reply_data } = req.query;
    try {
      const comment = await CommentModel.findOne({ id });
      console.log(comment);
      comment.add_comment_list.push({
        content: reply_data,
      });
      comment.save();
      res.send({
        status: 200,
        message: "回复成功",
      });
    } catch (e) {
      console.log(e);
      res.send({
        status: -1,
        message: "回复失败",
      });
    }
  };
}

export default new Comment();
