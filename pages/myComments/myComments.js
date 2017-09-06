// pages/myComments/myComments.js 我的评价
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: imgurl,
    page: 1,
    totalPage: 0,
    dxHidden: true,
    list: [],
    num: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  //取评价列表
  getList: function () {
    var that = this;
    var username = wx.getStorageSync('username');
    if (!username) {
      app.register();
      username = wx.getStorageSync('username');
    }
    common.httpG(
      wxurl + "fankui/index",
      {
        "username": username,
      },
      function (res) {
        that.setData({
          num: res.data.num,
          list: res.data.data.data,
          page: res.data.data.current_page,
          totalPage: res.data.data.total / res.data.data.per_page,
        })
        // console.log(that.data.list)
      }
    )

  },
  delFankui: function (e) {
    var fankui_id = e.currentTarget.dataset.fankui_id;
    //    console.log(fankui_id)
    var that = this;
    wx.showModal({
      title: '删除评价',
      content: '确认删除评价吗？',
      success: function (res) {
        if (res.confirm) {
          common.httpG(
            wxurl + "fankui/delete",
            {
              "id": fankui_id,
            },
            function (res) {
              that.getList();
            }
          )
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
    var totalPage = this.data.totalPage;
    var that = this;
    var list = this.data.list;
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

    common.httpG(wxurl + 'fankui/index', { "page": page + 1, username: username }, function (res) {
      var new_list = res.data.data.data;
      for (var i = 0; i < new_list.length; i++) {
        list.push(new_list[i]);
      }
      //console.log('new',schools);
      that.setData({
        list: list,
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