var app = getApp();
Page({
  data: {
    categories: []
  },
  navigateToCategoryProduct(event) {
    var categoryId = event.currentTarget.dataset.cateId;
    var activityTitle = event.currentTarget.dataset.activityTitle;
    wx.navigateTo({
      url: '../category-product/category-product?id=' + categoryId + '&title=' + activityTitle,
    })
  },
  onLoad() {
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/activity.php', 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          categories: res.data
        })
      },
    })
  }
});
