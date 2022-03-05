import fetch from "node-fetch";
import Ids from "../models/ids.js";
import config from "../config.js";

export default class BaseClass {
  constructor() {
    this.idList = [
      "restaurant_id",
      "food_id",
      "order_id",
      "user_id",
      "address_id",
      "category_id",
      "sku_id",
      "admin_id",
      "pay_id",
      "comment_id",
    ];
  }

  async fetch(url = "", data = {}, type = "GET", resType = "JSON") {
    type = type.toUpperCase();
    resType = resType.toUpperCase();
    if (type == "GET") {
      let dataStr = ""; //数据拼接字符串
      Object.keys(data).forEach((key) => {
        dataStr += key + "=" + data[key] + "&";
      });

      if (dataStr !== "") {
        dataStr = dataStr.replace(/&$/, "");
        url = url + "?" + dataStr;
      }
      console.log(url);
    }

    let requestConfig = {
      method: type,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (type == "POST") {
      // 如果是post请求，需要对数据转换成字符串
      requestConfig.body = JSON.stringify(data);
    }
    let responseJson;
    try {
      const response = await fetch(url, requestConfig);
      if (resType === "TEXT") {
        responseJson = await response.text();
      } else {
        responseJson = await response.json();
      }
    } catch (err) {
      console.log("获取http数据失败", err);
      throw new Error(err);
    }
    return responseJson;
  }

  //获取id列表
  async getId(type_id) {
    if (!this.idList.includes(type_id)) {
      throw new Error("id类型错误");
    }
    try {
      const idData = await Ids.findOneAndUpdate({}, { $inc: { [type_id]: 1 } });
      return ++idData[type_id]; //返回当前类型id数量*/
    } catch (err) {
      console.log("获取ID数据失败");
      throw new Error(err);
    }
  }
}
