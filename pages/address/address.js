// pages/index/index.js
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxshopurl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    formHidden: true,
    improveAddressHidden: true,
    editAddressHidden: true,
    confirmAddressHidden: false,
  },
  //修改地址，再次调用选择地图
  tapEditAddress: function () {
    this.tapChooseLocation('edit');
  },
  //打开地图选择位置
  tapChooseLocation: function (act) {
    var that = this;
    var addressInfo = {};

    wx.chooseLocation({
      success: function (res) {
        var addr_name = res.name;
        var addr_detail = res.address;
        var latitude = res.latitude;
        var longitude = res.longitude;
        var address_more = '';

        addressInfo.addr_name = addr_name;
        addressInfo.addr_detail = addr_detail;
        addressInfo.latitude = latitude;
        addressInfo.longitude = longitude;
        addressInfo.address_more = address_more;
        //console.log(addressInfo)
        //返回位置后，出现添加表单
        that.setData({
          formHidden: false,
          editAddressHidden: true,
          confirmAddressHidden: false,
          addressInfo: addressInfo,

        });

      },
      fail: function (res) {
        console.log('choseaddfail:', res)
      }
    })
  },
  //提交 地址
  submitAddress: function (e) {
    var that = this;
    var data = e.detail.value;
    //console.log(data)
    //return ;
    //添加位置到服务器
    common.httpP(wxurl + "shop/add_address", {
      addr_name: data.addr_name,
      addr_detail: data.addr_detail,
      latitude: data.latitude,
      longitude: data.longitude,
      address_more: data.address_more
    }, function (res) {
      if (res.data.code == 0) {
        // console.log(res.data.msg)
        wx.showToast({
          title: res.data.msg,
        });
        that.setData({
          editAddressHidden: false,
          confirmAddressHidden: true,
          improveAddressHidden: true,
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var admin_name = wx.getStorageSync("admin_name");
    if (!admin_name) {
      this.adminLogin();
    }

    var that = this;
    console.log('index-shop');
    //请求位置
    common.httpG(wxurl + "/shop/get_address", {

    }, function (res) {
      if (res.data.code == 0) {//表示有地址
        console.log(res.data.msg)
        that.setData({
          addressInfo: res.data.data,
          editAddressHidden: false,
          confirmAddressHidden: true,
          formHidden: false,
          improveAddressHidden: true,
        });
      } else {
        that.setData({

          improveAddressHidden: false,
        });
      }
    });
  },
  adminLogin: function () {
    // console.log('not login;')
    wx.redirectTo({
      url: '/pages/login/login',
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
    console.log('index-shop');
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