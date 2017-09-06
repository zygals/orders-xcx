var app = getApp();
var wxurl = app.globalData.wxurl;

function getSt(status, good_st) {
  var st = '';
  if (status == '未支付' && good_st == "待做") {
    st = "未支付";
  } else if (status == '已支付' && good_st == "待做") {
    st = "待接单";
  }else if (status == '已支付' && good_st == "已接单") {
    st = "已接单";
  } else if (status == '已支付' && good_st == "已送出") {
    st = "待收货";
  } else if (status == '已支付' && good_st == "已收到") {
    st = "已完成";
  } else if (status == '已支付' && good_st == "已评价") {
    st = "已评价";
  } else if (status == '退款中' && good_st == "待做") {
    st = "退款中";
  } else if (status == '退款成功' && good_st == "待做") {
    st = "退款成功";
  }else if(status == '退款失败'){
    st = "退款失败";
  } else if (status == '转入代发') {
    st = "转入代发";
  }
  return st;

}
//支付公用  
function payNow(obj,env,common){
  wx.showLoading({
    title: '请求支付中...',
  })
  var order_id = obj.data.order.id;
  var note = env.detail.value.note;
  var username = wx.getStorageSync('username');
  if (username == "") {//如果用户名不存在，重新登录一次。
    app.register();
    username = wx.getStorageSync('username');
  }

  common.httpP(
    wxurl + 'pay/pay_now',
    {
      order_id: order_id,
      username: username,
      note: note,
    },
    function (res) {
      if (res.data.code == 0) {
        wx.hideLoading();
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
              wxurl + 'order/update_st',
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
          fail: function (res) {
            wx.showModal({
              title: '查看订单',
              content: '在我的中心可以查看订单',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/orders/orders',
                  })
                }
              }
            });
          }
        })
      }
    }
  );
}

module.exports = {
  payNow: payNow,
  getSt: getSt,
}
