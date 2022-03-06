import fetch from "node-fetch";
import Ids from "../models/ids.js";
import config from "../config.js";
//先引入 jsonwebtoken
import jsonWebToken from "jsonwebtoken";
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
    this.token = "";
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

  // 生成 token
  setToken(user_id) {
    //密钥，当然实际的项目中密钥应该变态一些
    const SECRET_KEY = "agul123";

    this.token = jsonWebToken.sign(
      {
        // Payload 部分，官方提供七个字段这边省略，可以携带一些可以识别用户的信息。例如 username。
        // 千万不要是用敏感信息，例如密码，Payload 是可以解析出来的。
        user_id: user_id,
      },
      SECRET_KEY,
      {
        expiresIn: "24h", //token有效期
        // expiresIn: 60 * 60 * 24 * 7,  两种写法
        // algorithm:"HS256"  默认使用 "HS256" 算法
      }
    );
    console.log(this.token);
  }
}
