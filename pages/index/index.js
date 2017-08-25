//index.js
//获取应用实例
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;
Page({
  data: {
    shop: {},
    imgurl: imgurl,
    wifi: false,   //1
    swingCard: false,//2刷卡
    carStop: false,//3停车
    box_: false, //4包箱
    inShop: false,//堂食
    outShop: false,//外送
  },
  //打电话事件
  tapCalling:function(e){
    var phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //打开地图事件
  tapOpenAddress: function (e) {
    var latitude = e.target.dataset.latitude;
    var longitude = e.target.dataset.longitude;
    console.log(latitude, longitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
    })
  },

  onLoad: function () {
    //console.log('onLoad')
    var that = this
    var shop;
    //请求店铺信息
    common.httpG(wxurl + 'shop/get_shop', {}, function (res) {
      if (res.data.code == 0) {//表示返回正常数据
        that.setData({
          shop: res.data.data
        });
        //功能修改
        shop = that.data.shop;
        // console.log(typeof shop.functions)

        //console.log(shop.functions)
        if (common.inArray(shop.functions, 1)) {
          that.setData({
            wifi: true
          })
        }
        if (common.inArray(shop.functions, 2)) {
          that.setData({
            swingCard: true
          })
        }
        if (common.inArray(shop.functions, 3)) {
          that.setData({
            carStop: true
          })
        }
        if (common.inArray(shop.functions, 4)) {
          that.setData({
            box_: true
          })
        }
        if (common.inArray(shop.in_or_out, 1)) {
          that.setData({
            inShop: true
          })
        }

        if (common.inArray(shop.functions, 2)) {
          that.setData({
            outShop: true
          })
        }


      }
    });

  }
})
