// pages/orders/orders.js  我的所有订单
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
    page: 1,
    totalPage: 0,
    dxHidden: true,
   orders:[],
   st:'',
   ordAll:"ord_all_now.png",
   ordFankui: "ord_fankui_not.png",
   ordRefund: "ord_refund_not.png",
   active_all:'active',
   active_fankui: '',
   active_refund: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
      //取我的所有订单
      this.getOrders('');
      this.setData({
        st:''
      });
  
  },
  //请求所有订单方法
  getOrders: function (st) {
    var that = this;
    var username = wx.getStorageSync('username');
    if (!username){
      app.register();
      username = wx.getStorageSync('username');
    }
    common.httpG(
      wxurl + 'order/',
      {
        username: username,
        st:st
      },
      function (res) {
        var orders = res.data.data.data;
        for (var i = 0; i < orders.length;i++){
          orders[i].st = ord.getSt(orders[i].status, orders[i].good_st);
        }
        that.setData({
          orders: orders,
          page: res.data.data.current_page,
          totalPage: res.data.data.total / res.data.data.per_page,
        });
      }
    );
  },
  //全部
  getOrdersAll: function () {
    this.setData({
      st: '',
      dxHidden: true,
      ordAll: "ord_all_now.png",
      ordFankui: "ord_fankui_not.png",
      ordRefund: "ord_refund_not.png",
      active_all: 'active',
      active_fankui: '',
      active_refund: '',
    });
    this.getOrders('');
  }, 
  //待评介
  getOrdersDaiFanKui:function(){
    this.setData({
      st: 'dai_fankui',
      dxHidden: true,
      ordAll: "ord_all_not.png",
      ordFankui: "ord_fankui_now.png",
      ordRefund: "ord_refund_not.png",
      active_all: '',
      active_fankui: 'active',
      active_refund: '',
    });
    this.getOrders('dai_fankui');
}, 
 //退款
  getOrdersFefund: function () {
    this.setData({
      st: 'refund',
      dxHidden: true,
      ordAll: "ord_all_not.png",
      ordFankui: "ord_fankui_not.png",
      ordRefund: "ord_refund_now.png",
      active_all: '',
      active_fankui: '',
      active_refund: 'active',
    });
    this.getOrders('refund');
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var order_id = e.target.dataset.order_id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消吗？取消后不可恢复',
      success: function (res) {
        if (res.confirm) {
          //确定要删除则请求删除接口
          common.httpG(wxurl + 'order/update_st', { order_id: order_id, status: "cancel" }, function (obj) {
            wx.showToast({
              title: '订单取消成功',
            })
            that.getOrders();
          });
        }
      }
    });

  },
  //删除
  tapDel: function (e) {
    var that = this;
    var order_id = e.target.dataset.order_id;
    wx.showModal({
      title: '删除订单',
      content: '确定要删除吗？删除后不可恢复！',
      success: function (res) {
        if (res.confirm) {
          common.httpG(wxurl + 'order/update_st', { order_id: order_id, status: "del" }, function (obj) {
            wx.showToast({
              title: '删除成功',
            })
            that.getOrders();

          });
        }
      }
    });
  },
  confirmTaken:function(e){
    var that = this;
    var order_id = e.target.dataset.order_id;
    wx.showModal({
      title: '确认收到',
      content: '确认已收到您的点餐',
      success: function (res) {
        if (res.confirm) {
          common.httpG(wxurl + 'order/update_st', { order_id: order_id, status: "taken" }, function (obj) {
            wx.showToast({
              title: '确认成功',
            })
            that.getOrders();
          });
        }
      }
    });
  },
  //退款申请
  refund:function(e){
    var that = this;
    wx.showModal({
      title: '退款申请',
      content: '确认要进行退款申请吗？退款将原路返回,用零钱支付的会在20分钟内到账，银行卡支付3个工作日后',
      success: function (res) {
        if (res.confirm) {
          var order_id = e.target.dataset.order_id;
          var username = wx.getStorageSync('username');
          if (!username) {
            app.register();
            username = wx.getStorageSync('username');
          }
          common.httpG(wxurl + 'pay/refund', { order_id: order_id, username: username }, function (obj) {
            wx.showToast({
              title: '申请成功',
            })
            that.getOrdersFefund();
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
    var page = Number(this.data.page);
    var st = this.data.st;
    //console.log(page+1);
    var totalPage = this.data.totalPage;
    var that = this;
    var orders = this.data.orders;
    var username = wx.getStorageSync('username');
    if (!username) {
      app.register();
      username = wx.getStorageSync('username');
    }
    if (page >= totalPage) {
      this.setData({
        dxHidden: false,
      });
      return;
    }

    common.httpG(wxurl + 'order', { "page": page + 1, username: username,st:st}, function (res) {
      var new_list = res.data.data.data;
      for (var i = 0; i < new_list.length; i++) {
        orders.push(new_list[i]);
      }
      //console.log('new',schools);
      that.setData({
        orders: orders,
        page: res.data.data.current_page
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})