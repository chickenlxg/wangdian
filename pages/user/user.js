var app = getApp();
Page({
  data: {
    userInfo: {},
    isManager: null,
    order: {
      icon: 'images/order.png',
      text: '我的订单',
      tip: '',
      url: '../orders/orders?t=全部'
    },
    orderBadge: {
      unpaid: 0,
      undelivered: 0,
      unreceived: 0
    },
    orderCell: [
      {
        icon: 'images/to-be-paid.png',
        text: '待付款',
        url: '../orders/orders?t=待付款',
        class: 'order-cell-icon-small'
      }, {
        icon: 'images/to-be-delivered.png',
        text: '待发货',
        url: '../orders/orders?t=待发货',
        class: 'order-cell-icon-small',
      }, {
        icon: 'images/to-be-received.png',
        text: '待收货',
        url: '../orders/orders?t=待收货',
        class: 'order-cell-icon-big'
      }
    ],
    list: [
      {
        icon: 'images/address.png',
        text: '地址管理',
        tip: '',
        cut: true,
        url: '../addresses/addresses'
      }, {
        icon: 'images/tel.png',
        text: '客服电话',
        tip: '1383838388',
      }, {
        icon: 'images/about.png',
        text: '关于商城',
        tip: '',
        url: '../about/about'
      }
    ]
  },
  onShow() {
    if (app.globalData.isUser == '0') {
      wx.navigateTo({
        url: '../user-register/user-register'
      });
    };
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/olderdata.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        activeNav: 'user'
      },
      success: function (res) {
        const orderList = res.data;
        that.countOrder(orderList);
      },
    });
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.request({
      url: app.serverURL + '/get/web/isManager.php',
      data: {
        code: app.globalData.userID
      },
      success: function (res) {
        that.setData({
          isManager: res.data
        });
      }
    })
  },
  countOrder(orderList) {
    this.orderBadge = { unpaid: 0, undelivered: 0, unreceived: 0 };
    for (let i = orderList.length - 1; i >= 0; i--) {
      switch (orderList[i].status) {
        case '待付款': this.orderBadge.unpaid += 1; break;
        case '待发货': this.orderBadge.undelivered += 1; break;
        case '待收货': this.orderBadge.unreceived += 1; break;
        default: break;
      }
    }
    this.data.orderCell[0].count = this.orderBadge.unpaid;
    this.data.orderCell[1].count = this.orderBadge.undelivered;
    this.data.orderCell[2].count = this.orderBadge.unreceived;
    this.setData({
      orderBadge: this.orderBadge,
      orderCell: this.data.orderCell
    });
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    if (e.currentTarget.dataset.urlType) {
      wx.navigateTo({
        url: 'user-alter/user-alter'
      });
    } else {
      if (url === undefined) {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.tip
        });
      } else {
        wx.navigateTo({
          url
        });
      }
    }
  },
  usermanage(){
    wx.navigateTo({
      url: '../manager/user-alter/user-alter'
    });
  }
});
