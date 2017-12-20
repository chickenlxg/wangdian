var app = getApp();
Page({
  data: {
    products: [],
    currentPage: 1,
    perPage: 6
  },

  onLoad: function (options) {
    var that = this;
    var categoryType = options.id;
    var pageData = new Object();
    pageData.page = this.data.currentPage; 
    pageData.per_page = this.data.perPage; 
    wx.request({
      url: app.serverURL + '/get/web/products.php',
      data: {
        id: categoryType
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          products: res.data
        })
      },
    });
    wx.setNavigationBarTitle({
      title: options.title,
    });
  },
  navigateToProduct(event) {
    var productId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '../products/products?id=' + productId
    });
  }
})