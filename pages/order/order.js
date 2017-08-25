// pages/order/order.js
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;
var username = wx.getStorageSync('username');
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
  },

  //立即支付
  payNow: function () {
    wx.showLoading({
      title: '请求支付中...',
    })
    var order_id = this.data.order.id;
    //username = username;
    // console.log(order_id, username)
    //return ;
    common.httpP(
      wxurl + 'pay/pay_now',
      {
        order_id: order_id,
        username: username
      },
      function (res) {
        console.log(res.data)
        // return;
        if (res.data.state == 1) {
          console.log('服务器请求微信接口成功')
          wx.hideLoading();
          // return ;
          //调起客户端支付功能
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            'package': res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,//签名,
            success: function (res) {
              //更改订单状态为已支付
              common.httpP(
                wxurl + 'order/update_status',
                {
                  order_id: order_id,
                  status: 'paid'
                },
                function (res) {

                }
              );
              //支付成功转至所有订单页面
              wx.redirectTo({
                url: '/pages/orders/orders',
              })
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        }
      }
    );
  },
  submitOrder: function (e) {
    if (this.data.orderAddress.id == 0) {
      wx.showToast({
        title: '请添加地址',
      })
      return;
    }
    // console.log(e);
    var note = e.detail.value.note;
    var order_id = this.data.order.id;
    if (note != '') {
      common.httpP(
        wxurl + 'order/add_note',
        {
          order_id: order_id,
          note: note,

        },
        function (res) {
        }
      );
    }
    //请求支付
    this.payNow();

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
   * 生命周期函数--监听页面加载 //外送订单
   */
  onLoad: function (options) {
    var that = this;
    var new_order_id = options.new_order_id;   //
  //  new_order_id = 7;

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

      });
    //根据订单id查询所有相关信息:

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