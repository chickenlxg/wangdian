var app = getApp();
Page({
  data: {
    loading: false,
    activeNav: 'all',
    navs: [{
      text: '全部',
      alias: 'all'
    }, {
      text: '待付款',
      alias: 'unpaid'
    }, {
      text: '待发货',
      alias: 'undelivered'
    }, {
      text: '待收货',
      alias: 'unreceived'
    }],
    orderList: []
  },
  onLoad(options) {
    const that = this;
    if (options.t) {
      this.setData({
        activeNav: options.t
      });
    }
    wx.request({
      url: app.serverURL + '/get/web/olderdata.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        activeNav: this.data.activeNav
      },
      success: function (res) {
        that.setOrderData(res.data);
        that.setData({
          orderList: res.data,
          loading: false
        });
      },
    })
  },
  setOrderData(data) {
    data.forEach((itm) => {
      var totalNumber = 0;
      var totalPrice = 0;
      var wxPrice = 0;
      itm.goods.forEach(item => {
        item.PNUM *= 1;
        totalNumber += item.PNUM;
        totalPrice += item.PNUM * item.goods_price;
      })
      itm.wxPrice = (totalPrice * 10);
      itm.totalNumber = totalNumber;
      itm.totalPay = totalPrice.toFixed(2);
      itm.order = {
        orderStatus: itm.status,
        orderSn: itm.orderSn,
        subOrderSn: itm.sub_order_sn,
        isButtonHidden: itm.status == "待付款" ? true : false,
      };
    });
    return data;
  },
  changeList(e) {
    const that = this;
    const alias = e.target.dataset.text;

    if (alias !== this.data.activeNav) {
      this.setData({
        activeNav: e.target.dataset.text,
        loading: true
      });

      wx.request({
        url: app.serverURL + '/get/web/olderdata.php',
        header: {
          'content-type': 'application/json'
        },
        data: {
          userID: app.globalData.userID,
          activeNav: e.target.dataset.text
        },
        success: function (res) {
          that.setOrderData(res.data);
          that.setData({
            orderList: res.data,
            loading: false
          });

        },
      })
    }
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
            that.data.orderList.forEach((item, key) => {
              if (item.orderSn == orderSn) {
                if (that.data.activeNav != "全部") {
                  that.data.orderList.splice(key, 1);
                }
                item.status = '订单关闭';
              }
            })

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
            }, 1000);
            that.setData({ orderList: that.setOrderData(that.data.orderList) });
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
            that.data.orderList.forEach((item, key) => {
              if (item.orderSn == orderSn) {
                if (that.data.activeNav != "全部") {
                  that.data.orderList.splice(key, 1);
                }
                item.status = '售后处理中';
              }
            })
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
            }, 1000);
            that.setData({ orderList: that.setOrderData(that.data.orderList) });
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
            that.data.orderList.forEach((item, key) => {
              if (item.orderSn == orderSn) {
                if (that.data.activeNav != "全部") {
                  that.data.orderList.splice(key, 1);
                }
                item.status = '交易成功';
              }
            })
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
            }, 1000);
            that.setData({ orderList: that.setOrderData(that.data.orderList) });
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
            that.data.orderList.forEach((item, key) => {
              if (item.orderSn == orderSn) {
                that.data.orderList.splice(key, 1);
              }
            })
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
            that.setData({ orderList: that.setOrderData(that.data.orderList) });
          }
        })

      }
    });
  },
  payOrder(e) {
    const orderSn = e.target.dataset.orderSn;
    wx.navigateTo({
      url: '../settlement2/settlement2?orderSn=' + orderSn,
    });
  }
});
