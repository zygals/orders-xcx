// pages/details/details.js
var common = require("../../utils/util.js");
var ord = require("../../utils/ord.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: imgurl,
    order: {},
    st:'',
    orderGoods: [],
    orderAddress: {},
    feeBox: 0,
    inOrOut:'',
    in_: "堂食",
    out_: "外送",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_id = options.order_id;   //
    var in_or_out = options.type;
    that.setData({
      inOrOut: in_or_out,
    });
    var username = wx.getStorageSync('username');
    if (!username) {
      app.register();
      username = wx.getStorageSync('username');
    }
    //根据订单号查询里面商品
    common.httpG(wxurl + "order/get_order",
      {
        'order_id': order_id,
        'type': in_or_out, //
        "username": username,
      },
      function (res) {
        that.setData({
          orderGoods: res.data.data.order_goods,
          order: res.data.data.order,
          orderAddress: res.data.data.address
        });
        //分析订单状态
        var order = that.data.order;
        var st = ord.getSt(order.status,order.good_st);
        that.setData({
          st: st,
        });
        //计算餐盒费总和
        if (in_or_out =='外送'){
          var orderGoods = that.data.orderGoods;
          var feeBox = 0;
          for (var i = 0; i < orderGoods.length; i++) {
            feeBox += Number(orderGoods[i].fee_canhe);
            that.setData({
              feeBox: feeBox,
            });
          }
       } 
      
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})