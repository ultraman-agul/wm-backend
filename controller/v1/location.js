import BaseClass from "../../prototype/baseClass.js";
import config from "../../config.js";
class Location extends BaseClass {
  constructor() {
    super();
  }

  //根据ip定位定位  只能获取到经纬度和省份城市  不能获取到具体位置 还需要调用下方接口获取具体位置
  getLocation = async (req, res, next) => {
    let { ip } = req.query;
    console.log("获取的地址是", ip);
    //ip = '120.197.198.68';
    let getResult = await this.fetch(
      "http://apis.map.qq.com/ws/location/v1/ip",
      {
        ip: ip,
        key: config.tencentkey,
      },
      "GET"
    );
    console.log(
      "请求的地址",
      "http://apis.map.qq.com/ws/location/v1/ip",
      ip,
      config.tencentkey
    );
    console.log(getResult);
    if (getResult.status == 0) {
      const cityInfo = {
        lat: getResult.result.location.lat, //纬度
        lng: getResult.result.location.lng, //经度
        city: getResult.result.ad_info.city,
      };
      cityInfo.city = cityInfo.city.replace(/市$/, "");
      return cityInfo;
    } else {
      res.send({
        status: -1,
        message: "腾讯通过ip获取地址接口失败",
      });
      // 如果请求的接口都失败，返回默认地址
      return { lat: 40.22077, lng: 116.23128, city: "北京市" };
    }
  };

  //根据经纬度获取详细地址信息
  getDetailPosition = async (location, res, successFn) => {
    try {
      let cityInfo;
      if (location) {
        cityInfo = await this.fetch(
          "http://apis.map.qq.com/ws/geocoder/v1",
          {
            location: location.lat + "," + location.lng,
            key: config.tencentkey,
          },
          "GET"
        );
        console.log(cityInfo);
        if (cityInfo.status == 0) {
          let address = cityInfo.result.address.replace(/^.{2}省.{2}市/, "");
          successFn({
            address,
            location,
          });
        }
      }
    } catch (err) {
      res.send({
        status: -1,
        message: "获取定位失败",
      });
    }
  };

  // 获取用户当前位置，使用了上方两个接口
  location = async (req, res, next) => {
    const result = await this.getLocation(req, res); // 根据ip获取到经纬度
    this.getDetailPosition(result, res, (data) => {
      res.send({
        status: 200,
        message: "获取当前位置成功",
        data,
      });
    });
  };

  //根据关键词搜索位置
  locationSearch = async (req, res, next) => {
    try {
      const { keyword } = req.query;
      const reqData = {
        keyword: encodeURI(keyword),
        key: config.tencentkey,
        policy: 1,
      };
      const data = await this.fetch(
        "http://apis.map.qq.com/ws/place/v1/suggestion",
        reqData,
        "GET"
      );
      res.send({
        status: 200,
        data,
      });
    } catch (err) {
      res.send({
        status: -1,
        message: "搜索位置出错" + err,
      });
      console.log("搜索位置出错", err);
    }
  };
}

export default new Location();
