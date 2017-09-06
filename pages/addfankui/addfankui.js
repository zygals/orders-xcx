// 添加评价页
var common = require("../../utils/util.js");
var app = getApp();
const wxurl = app.globalData.wxurl;
const imgurl = app.globalData.imgurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: 0,
    imgurl: imgurl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order_id = options.order_id;
    this.setData({
      order_id: order_id,
    });

  },
  addFankui: function (e) {
    var cont = e.detail.value.cont;
    var that = this;
    var order_id = this.data.order_id;

    var username = wx.getStorageSync('username');
    if (username == "") {//如果用户名不存在，重新登录一次。
      app.register();
      username = wx.getStorageSync('username');
    }
    common.httpP(wxurl + 'fankui/save', { order_id: order_id, username: username, cont: cont }, function (obj) {
      if(obj.data.code==0){
        wx.showToast({
          title: '添加成功了',
        })
        wx.navigateTo({
          url: '/pages/orders/orders',
        })
      }
     
    });
  },
  addFankui2: function (e) {
    var cont = e.detail.cont;
  console.log(cont,'sdsf');

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