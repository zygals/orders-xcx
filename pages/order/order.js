// pages/order/order.js
var common = require("../../utils/util.js");
var ord = require("../../utils/ord.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;
const IN_ = app.globalData.in_;//堂食
const OUT_ = app.globalData.out_;//送s

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    orderGoods: [],
    orderAddress: {},
    feeBox: 0,
  },
  /**
   * 生命周期函数--监听页面加载 //外送订单
   */
  onLoad: function (options) {
    var that = this;
    var new_order_id = options.new_order_id;   //
    var username = wx.getStorageSync('username');
    if (!username) {
      app.register();
      username = wx.getStorageSync('username');
    }

    //根据订单号查询里面商品
    common.httpG(wxurl + "order/get_order",
      {
        'order_id': new_order_id,
        'type': OUT_, //
        "username": username,
      },
      function (res) {
        that.setData({
          orderGoods: res.data.data.order_goods,
          order: res.data.data.order,
          orderAddress: res.data.data.address
        });
        //计算餐盒费总和
        var orderGoods = that.data.orderGoods;
        var feeBox = 0;
        for (var i = 0; i < orderGoods.length; i++) {
          feeBox += Number(orderGoods[i].fee_canhe);
          that.setData({
            feeBox: feeBox,
          });
        }
      });

  },
  //立即支付-外送

  payNowOut: function (e) {
    if (this.data.orderAddress.id == 0) {
      wx.showToast({
        title: '请添加地址',
      })
      return;
    }
    ord.payNow(this, e, common);
  },
  //选择收货地
  tapChooseAdress: function () {

    this.chooseAdress_()
  },
  chooseAdress_: function () {
    var order_id = this.data.order.id;
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var provinceName = res.provinceName;
        var cityName = res.cityName;
        var countyName = res.countyName;
        var info = res.detailInfo;
        var mobile = res.telNumber;
        var true_name = res.userName;
        var pcd = provinceName + ' ' + cityName + ' ' + countyName;
        //请求添加地址
        wx.request({
          url: wxurl + 'address/save',
          method: 'post',
          data: {
            order_id: order_id,
            true_name: true_name,
            mobile: mobile,
            pcd: pcd,
            info: info,
            username: username,
          },
          success: function (res) {
            common.httpG(wxurl + 'order/get_order_address',
              {
                address_id: res.data.address_id
              },
              function (res) {
                that.setData({
                  orderAddress: res.data.data
                });
              }
            );
          }
        })
      },//如果第一次拒绝
      fail: function (res) {
        if (res.errMsg == 'chooseAddress:cancel') {
          return;
        }
        wx.openSetting({
          success: function (res) {
            if (res.authSetting["scope.address"] == true) {
              that.chooseAdress_()
            } else {
              console.log('没有同意地址选框')
            }
          }
        })
      }
    })
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