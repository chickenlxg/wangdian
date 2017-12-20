var app = getApp();

Page({

  data: {
    banners: [],
    activities: [],
    shop_info: [],
    features: []
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/swiper.php',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          banners: res.data
        })
      },
    })
    wx.request({
      url: app.serverURL + '/get/web/activity.php',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          activities: res.data
        })
      },
    })
    wx.request({
      url: app.serverURL + '/get/configdata.php',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          shop_info: res.data
        })
      },
    })
    wx.request({
      url: app.serverURL + '/get/web/features.php',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          features: res.data
        })
      },
    })
  },

  navigateToActivity(event) {
    var activityType = event.currentTarget.dataset.activityType;
    var activityId = event.currentTarget.dataset.activityId;
    var activityTitle = event.currentTarget.dataset.activityTitle;
    var productId = event.currentTarget.dataset.productId;
    var activityUrl;
    switch (activityType) {
      case '1':
        activityUrl = "../category-product/category-product?id=" + activityId + '&title=' + activityTitle;
        break;
      case '2':
        activityUrl = "../products/products?id=" + activityId;
        break;
      case '3':
        activityUrl = event.currentTarget.dataset.activityUrl;
        break;
      default:
        break;
    }
    wx.navigateTo({
      url: activityUrl
    });
  },

  navigateToProduct(event) {
    var productId = event.currentTarget.dataset.productId;
    var productUrl = "../products/products?id=" + productId;
    wx.navigateTo({
      url: productUrl
    });
  }
})