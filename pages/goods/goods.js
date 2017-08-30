// pages/goods/goods.js
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;

const IN_ = app.globalData.in_;//堂食
const OUT_ = app.globalData.out_;//送
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgurl: imgurl,
    cates: [],
    goods: [],  //商品列表
    cartGoods: [],//购物车商品
    cateSeleted: 0, //选择分类，默认选择第一个
    cartGoodsHidden: true,
    num: 1,
    sum_good_num: 0,
    sumNumHidden: true,
    sumPriceHidden: true,
    sumPrice: 0, // 车中商品总价
    inOrOut: IN_,
    feePostHidden: true,
    feePost: 0,  // 外卖配送费
    feeStartPost: 0,//  外送起送费
    feeCha: 0,
    cateIdNow: 0, //当前选择的分类id
    plusHidden: false,
    feeStartHidden: true,
    selectOkHidden: false,
    selOkNo:true,
  },
  //选好了,添加订单
  tapSelectOk: function () {
    var cart_goods = this.data.cartGoods;
    var order_type = this.data.inOrOut;
    var fee_post = this.data.feePost;
    var that = this;
    if (this.data.sumPrice < this.data.feeStartPost) {
      wx.showToast({
        title: '不满足起送费',
      })
      return;
    }
    if (cart_goods.length == 0) {
      return;
    }
    this.setData({
      selOkNo: true,
    });
    var username = wx.getStorageSync('username');
    if (username == "") {//如果用户名不存在，重新登录一次。
      app.register();
      username = wx.getStorageSync('username');
    }
    //请求添加订单
    common.httpG(wxurl + "/order/add_order", {
      username: username,
      order_type: order_type,   //1 / 2
      cart_goods: cart_goods //数组字符串
    }, function (res) {
      that.setData({
        selOkNo: false,
      });
      //根据返回的订单id跳转至订单页面
      if (order_type == IN_) {
        wx.navigateTo({
          url: '/pages/orderIn/orderIn?new_order_id=' + res.data.data,
        })
      }
      if (order_type == OUT_) { //
        wx.navigateTo({
          url: '/pages/order/order?new_order_id=' + res.data.data,
        })
      }

    });

  },
  //清空车
  tapClearCart: function () {
    var goods;
    var that = this;
    wx.showModal({
      title: '清空商品',
      content: '确定清空您选择的商品吗？',
      success: function (res) {
        if (res.confirm) {
          goods = that.data.goods;
          //商品列表也同步成为默认状态
          for (var i = 0, lenG = goods.length; i < lenG; i++) {
            goods[i].plus_default_show = 1;
          }
          that.setData({
            goods: goods,
            cartGoods: [],
            sumPrice: 0,
            sum_good_num: 0,
            sumNumHidden: true,
            sumPriceHidden: true,
            cartGoodsHidden: true,
            selOkNo: true,
           
          });
          if (that.data.inOrOut==OUT_){
            that.setData({
            
              selectOkHidden: true,
              feeCha: that.data.feeStartPost,
              feeStartHidden: false,
            });
          }

        }
      }
    })

  },
  //减少
  tapReduceCartGood: function (e) {
    var target_ = e.target.dataset;
    var good_id = target_.good_id,
      price_now = target_.price_now, 
      cart_goods = this.data.cartGoods,
       goods = this.data.goods, sum_price = 0,
        fee_start_post = this.data.feeStartPost,
      fee_cha,
      in_out_out=this.data.inOrOut;
    //变化总价

    for (var i = 0, len = cart_goods.length; i < len; i++) {
      if (cart_goods[i].good_id == good_id) {
        cart_goods[i].num--;
        cart_goods[i].sum_price_good = Number(price_now) * 100 * Number(cart_goods[i].num) / 100;
        if (cart_goods[i].num <= 0) {
          cart_goods.splice(i, 1);
          for (var j = 0, lenG = goods.length; j < lenG; j++) {
            if (good_id == goods[j].id) {
              goods[j].plus_default_show = 1
              this.setData({
                goods: goods,
              })
              break;
            }
          }
        }
        break;
      }
    }
    for (var i = 0, len = cart_goods.length; i < len; i++) {
      sum_price += Number(cart_goods[i].sum_price_good) * 100;
    }
    if (sum_price / 100 < fee_start_post) {
      fee_cha = fee_start_post - sum_price / 100;
      this.setData({
        selectOkHidden: true,
        feeCha: fee_cha,
        feeStartHidden: false,
      })
    } else {
      this.setData({
        selectOkHidden: false,
        feeStartHidden: true,
      })
    }
    this.setData({
      cartGoods: cart_goods,
      sumPrice: sum_price / 100,
      sum_good_num: cart_goods.length,

    });
    //如果车中没有商品
    if (cart_goods.length <= 0) {
      this.setData({
        sumNumHidden: true,
        sumPriceHidden: true,
        cartGoodsHidden: true,
        selOkNo: true,
      });
      if (in_out_out==OUT_){
        this.setData({
         
          feePostHidden: false,
        });
      }

    }
  },
  //增加购物车商品事件
  tapAddCartGood: function (e) {
    var target_ = e.currentTarget.dataset;
    var good_id = target_.good_id,//购物车商品模型
      cate_id = target_.cate_id,
      cate_id_now = this.data.cateIdNow,
      name = target_.name,
      price_now = target_.price_now,
      num = target_.num,
      arr_good = this.data.cartGoods,
      good = {},//要添加进购物车的商品
      hasGood = false, //购物车是否有此商品？
      //车中总价
      sum_price = 0,
      goods = this.data.goods,
      fee_start_post = this.data.feeStartPost,
      fee_cha = this.data.feeCha;//差多少起送

    good.name = name;
    good.price_now = price_now;
    good.sum_price_good = price_now;
    good.num = num;
    good.good_id = good_id;
    good.cate_id = cate_id;
    for (var i = 0, len = arr_good.length; i < len; i++) {
      //如果商品在车中
      if (arr_good[i].good_id == good.good_id) {
        // console.log('add num....')
        hasGood = true;
        arr_good[i].num++;
        if (arr_good[i].num > 0) {//计算单个商品总价
          arr_good[i].sum_price_good = Number(good.price_now) * 100 * Number(arr_good[i].num) / 100;
        }
        //购物车商品数目改变了，列表数目也要改
        break;
      }
    }
    if (hasGood === false) {
      arr_good.push(good);//保证后面加的商品在上面显示
      for (var i = 0, lenG = goods.length; i < lenG; i++) {
        if (good.good_id == goods[i].id) {
          goods[i].plus_default_show = 0
          this.setData({
            goods: goods,
          })
          break;
        }

      }
      this.setData({
        selOkNo: false,
      })

    }
    for (var k = 0, lenC = arr_good.length; k < lenC; k++) {
      sum_price += Number(arr_good[k].sum_price_good) * 100;
    }
    if (sum_price / 100 < fee_start_post) {
      fee_cha = fee_start_post - sum_price / 100;
      this.setData({
        feeCha: fee_cha
      })
    } else {
      this.setData({
        selectOkHidden: false,
        feeStartHidden: true,
      })
    }
    // console.log(arr_good)
    this.setData({
      cartGoods: arr_good,
      sum_good_num: arr_good.length,
      sumNumHidden: false,
      sumPrice: sum_price / 100,
      sumPriceHidden: false,
    });
  },
  //车内商品显示隐藏
  tapShowHideCartGoods: function () {
    var cartGoodsHidden = this.data.cartGoodsHidden;
    var cart_goods = this.data.cartGoods;
    //如果车中没商品，则不执行
    if (cartGoodsHidden == true && cart_goods.length == 0) {
      return;
    }
    this.setData({
      cartGoodsHidden: !cartGoodsHidden
    });
  },
  //点击分类，加载商品
  tapCate: function (e) {
    var that = this;
    var cate_id = e.target.dataset.cate_id; //3
    var cate_id_now = this.data.cateIdNow;//4
    if (cate_id_now == cate_id) {//如果点击分类就是现在分类不用请求
      return;
    }
    var index = e.target.dataset.index;
    var in_or_out = this.data.inOrOut;//堂食或是外送
    var cache_name_now = "cateGoodsCache-" + cate_id_now; //cateGoodsCache-4
    var cache_name = "cateGoodsCache-" + cate_id;
    var cache_goods = [];
    var cart_goods = this.data.cartGoods;
    // console.log(cache_goods)
    if (this.data.goods) {
      wx.setStorageSync(cache_name_now, this.data.goods);
    }
    cache_goods = wx.getStorageSync(cache_name);
    //console.log(cache_goods, cart_goods)
    if (cache_goods) {
      var cart_good_have;//列表商品是否在车中
      for (var i = 0, len = cache_goods.length; i < len; i++) { // 1
        cart_good_have = false;
        for (var j = 0, lenG = cart_goods.length; j < lenG; j++) {
          if (cart_goods[j].good_id == cache_goods[i].id) {
            cart_good_have = true;
          }
        }
        if (cart_good_have == false) {
          cache_goods[i].plus_default_show = 1
        }
      }

      that.setData({
        goods: cache_goods,
        cateSeleted: index,
        cateIdNow: cate_id
      });
      return;
    }

    //根据分类id请求商品
    common.httpG(wxurl + "good", { cate_id: cate_id, in_or_out: in_or_out }, function (res) {
      //  wx.setStorageSync(cache_name, res.data.data);
      that.setData({
        goods: res.data.data,
        cateSeleted: index,
        cateIdNow: cate_id
      });
      //更改左侧分类当前状态


    });
  },
  //加载商品分类
  loadCates: function () {
    var that = this;
    common.httpG(wxurl + "cate_shop_good", {}, function (res) {
      that.setData({
        cates: res.data.data,
        cateIdNow: res.data.data[0].id
      });

    });
  },
  //加载第一个分类下的商品
  loadGoods: function (in_or_out) {
    var cache_default_goods = wx.getStorageSync('cateGoodsCache-' + this.data.cateIdNow);
    if (cache_default_goods) {
      this.setData({
        goods: cache_default_goods
      });
      return;
    }
    var that = this;
    common.httpG(wxurl + "good/get_goods_default", { in_or_out: in_or_out }, function (res) {
      //缓存
      wx.setStorageSync('cateGoodsCache-' + that.data.cateIdNow, res.data.data);
      that.setData({
        goods: res.data.data
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var in_or_out = options.in_or_out;
    if (in_or_out == 2) {//外送
      var fee_start_post = options.fee_start_post;
      var fee_post = options.fee_post;
      this.setData({
        feePost: fee_post,
        feeStartPost: fee_start_post,
        feeCha: fee_start_post,
        feePostHidden: false,
        feeStartHidden: false,
        selectOkHidden: true,
      })
    }
    this.setData({
      inOrOut: in_or_out
    })
    this.loadCates();
    this.loadGoods(in_or_out);
    //如果送，
  },




  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    wx.removeStorageSync('cateGoodsCache-0');
    var cates = this.data.cates;
    for (var i = 0, lenC = cates.length; i < lenC; i++) {
      wx.removeStorageSync('cateGoodsCache-' + cates[i].id);
    }

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})