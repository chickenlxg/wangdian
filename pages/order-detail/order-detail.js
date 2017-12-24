var app = getApp();
Page({
  data: {
    address: [],
    cartList: [],
    freight: 0,
    totalPay: 0,
    wxpay: 0,
    wxPrice: 0,
    ok: 1,
    loading: true,
    exec: false,
    userIntegral: null,
    orderSn: null,
    order: []
  },
  onLoad(options) {
    this.setData({ orderSn: options.subOrderSn });
    const orderSn = options.subOrderSn;
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/addressGet.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: options.subOrderSn
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
        orderSn: options.subOrderSn
      },
      success: function (res) {

        var totalNumber = 0;
        var totalPrice = 0;
        var wxPrice = 0;
        res.data.forEach(item => {
          totalNumber += item.PNUM;
          totalPrice += item.PNUM * item.goods_price;
        })
        wxPrice = totalPrice * 10;
        that.setData({
          cartList: res.data,
          loading: false,
          totalNumber: totalNumber,
          totalPay: totalPrice.toFixed(2),
          wxPrice: wxPrice
        });
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/orderStatus.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        orderSn: options.subOrderSn
      },
      success: function (res) {
        console.log(res);
        that.setData({
          wxpay: res.data.wxpay,
          order: {
            orderStatus: res.data.status,
            refund_status: res.data.refund_status,
            orderSn: res.data.orderSn,
            isButtonHidden: res.data.status == "待付款" ? true : false,
            creatTime: res.data.creatTime,
            payTime: res.data.payTime
          }
        });
      }
    });
  },

  navigateToAddress() {
    var url = this.data.order.orderStatus == '待付款' ? '../addresses/addresses?type=order-detail&orderSn=' + this.data.orderSn : '';
    if (url) {
      wx.navigateTo({
        url: url,
      });
    }
  },
  payOrder(e) {
    const orderSn = e.target.dataset.orderSn;
    wx.navigateTo({
      url: '../settlement2/settlement2?orderSn=' + orderSn,
    });
  },
  cancelOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '你是否需要取消订单',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }
        wx.request({
          url: app.serverURL + '/get/web/cancalOrder.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '订单已取消！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
              wx.switchTab({
                url: '../user/user',
              });
            }, 1000);
          }
        })
      }
    });
  },
  drawbackOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '亲，你是否确定退款',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }
        wx.request({
          url: app.serverURL + '/get/web/drawbackOrder.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '申请已提交！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
              wx.switchTab({
                url: '../user/user',
              });
            }, 1000);
          }
        })
      }
    });
  },
  confirmOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '确定收货',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }
        wx.request({
          url: app.serverURL + '/get/web/confirmOrder.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '交易成功！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
              wx.switchTab({
                url: '../user/user',
              });
            }, 1000);
          }
        })
      }
    });
  },
  deleteOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '你是否要删除订单',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }

        wx.request({
          url: app.serverURL + '/get/web/deleteOrder.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '订单已删除！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
            }, 1000);
            wx.switchTab({
              url: '../user/user',
            });
          }
        })
      }
    });
  }
});
