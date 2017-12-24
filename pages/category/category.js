var app = getApp();
Page({
  data: {
    categories: [],
    toView: 'aa',
    selectedMenuId: 1,
    total: {
      count: 0,
      money: 0
    }
  },
  navigateToCategoryProduct(event) {
    var categoryId = event.currentTarget.dataset.cateId;
    var activityTitle = event.currentTarget.dataset.activityTitle;
    wx.navigateTo({
      url: '../category-product/category-product?id=' + categoryId + '&title=' + activityTitle,
    })
  },
  selectMenu: function (event) {
    let data = event.currentTarget.dataset
    this.setData({
      toView: data.tag,
      selectedMenuId: data.id
    })
  },
  addCount: function (event) {
    let data = event.currentTarget.dataset
    let total = this.data.total
    let menus = this.data.categories
    this.data.categories.forEach(item => {
      item.goods.forEach(
        item2 => {
          if (item2.id == data.id) {
            let dish = item2
            dish.count *= 1
            dish.goods_price *= 1
            dish.count += 1
            total.count += 1
            total.money += dish.goods_price
            if (dish.count == '1') {
              wx.request({
                url: app.serverURL + '/get/web/addcart.php',
                data: {
                  user_id: app.globalData.userID,
                  goods_id: dish.id,
                  goods_number: dish.count
                },
                header: {
                  'content-type': 'application/json'
                }
              })
            } else {
              wx.request({
                url: app.serverURL + '/get/web/cateProductNumChange.php',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  userID: app.globalData.userID,
                  pid: dish.id,
                  productNum: dish.count
                }
              })
            }
            this.setData({
              'categories': menus,
              'total': total
            })
          }
        }
      )
    });
  },
  minusCount: function (event) {
    let data = event.currentTarget.dataset
    let total = this.data.total
    let menus = this.data.categories
    this.data.categories.forEach(item => {
      item.goods.forEach(
        item2 => {
          if (item2.id == data.id) {
            let dish = item2
            dish.count *= 1
            dish.goods_price *= 1
            dish.count -= 1
            total.count -= 1
            total.money -= dish.goods_price
            if (dish.count == '0') {
              wx.request({
                url: app.serverURL + '/get/web/cateCartDel.php',
                data: {
                  userID: app.globalData.userID,
                  pid: dish.id
                },
                header: {
                  'content-type': 'application/json'
                }
              })
            } else {
              wx.request({
                url: app.serverURL + '/get/web/cateProductNumChange.php',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  userID: app.globalData.userID,
                  pid: dish.id,
                  productNum: dish.count
                }
              })
            }
            this.setData({
              'categories': menus,
              'total': total
            })
          }
        }
      )
    });
  },
  navigateToCart() {
    wx.switchTab({
      url: '../cart/cart'
    });
  },
  onShow() {
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/cateActivity.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID
      },
      success: function (res) {
        that.setData({
          categories: res.data
        })
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/cart.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: 'no'
      },
      success: function (res) {
        let total = that.data.total
        total.count = 0;
        total.money = 0;
        var totalNumber = 0;
        var totalPrice = 0;
        res.data.forEach(item => {
          item.PNUM = 1 * item.PNUM;
          item.status = 1 * item.status;
          totalNumber += item.PNUM;
          totalPrice += item.PNUM * item.goods_price;
          total.count = totalNumber;
          total.money = totalPrice;
        })
        that.setData({
          'total': total
        });
      },
    });
  }
});
