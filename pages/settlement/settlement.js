var app = getApp();
Page({
  data: {
    address: [],
    cartList: [],
    freight: 0,
    totalPay: 0,
    wxPay: 0,
    ok: 1,
    loading: true,
    exec: false,
    userIntegral: null,
    orderSn: null
  },
  onLoad(options) {
    this.setData({ orderSn: options.orderSn });
    const orderSn = options.orderSn;
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/addressGet.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: options.orderSn
      },
      success: function (res) {
        that.setData({ address: res.data })
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/cart.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        orderSn: options.orderSn
      },
      success: function (res) {
        var totalNumber = 0;
        var totalPrice = 0;
        var masterPrice = 0;
        var towxprice = 0;
        res.data.forEach(item => {
          totalNumber += item.PNUM;
          totalPrice += item.PNUM * item.goods_price;
          towxprice = totalPrice * 0.04;
          masterPrice += item.PNUM * item.market_price;
        })
        that.setData({
          cartList: res.data,
          loading: false,
          totalNumber: totalNumber,
          totalPay: totalPrice,
          masterPrice: masterPrice,
          wxPay: totalPrice == '0' ? masterPrice : towxprice.toFixed(2)
        });
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/integral.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID
      },
      success: function (res) {
        that.setData({ userIntegral: res.data.integral })
      },
    });

  },
  postOrder(options) {
    this.setData({ exec: true });
    var that = this;
    if (this.data.totalPay > this.data.userIntegral) {
      that.setData({
        exec: false,
        toast: {
          toastClass: 'yatoast',
          toastMessage: '积分不足'
        }
      });
      setTimeout(() => {
        that.setData({
          toast: {
            toastClass: '',
            toastMessage: ''
          }
        });
      }, 2000);
    } else {
      wx.request({
        url: app.serverURL + '/get/web/pay.php',
        header: {
          'content-type': 'application/json'
        },
        data: {
          userID: app.globalData.userID,
          orderSn: this.data.orderSn,
          totalPay: this.data.totalPay,
          userIntegral: this.data.userIntegral
        },
        success: function (res) {
          if (res.statusCode == '200') {
            that.setData({ exec: false });
            wx.switchTab({
              url: '../user/user',
            });
          } else {
            that.setData({
              exec: false,

              toast: {
                toastClass: 'yatoast',
                toastMessage: '获取支付验证错误!'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                }
              });
            }, 2000);
          };
        }
      });
    }
  },
  wxpostOrder(options) {
    this.setData({ exec: true });
    var that = this;
    wx.request({
      url: app.serverURL + '/wxpay/payfee.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: that.data.orderSn,
        wxPay: that.data.wxPay
      },
      success: function (res) {
        if (res.statusCode == '200') {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              wx.request({
                url: app.serverURL + '/wxpay/wxorder.php',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  userID: app.globalData.userID,
                  orderSn: that.data.orderSn,
                  wxPay: that.data.wxPay
                },
                success: function (res) {
                  that.setData({ exec: false });
                  wx.switchTab({
                    url: '../user/user',
                  });
                },
              });
            },
            'fail': function (res) {
              that.setData({
                exec: false,
                toast: {
                  toastClass: 'yatoast',
                  toastMessage: '支付失败!'
                }
              });
              setTimeout(() => {
                that.setData({
                  toast: {
                    toastClass: '',
                    toastMessage: ''
                  }
                });
              }, 2000);
            }
          })
        }
      }
    });
  },
  navigateToAddress() {
    wx.navigateTo({
      url: '../addresses/addresses?type=settlement&orderSn=' + this.data.orderSn,
    });
  }
});
