var app = getApp();
import menus from './menus.js'  //添加
Page({
  data: {
    categories: [],
    //添加
    text: "Page main",
    background: [
      {
        color: 'green',
        sort: 1
      },
      {
        color: 'red',
        sort: 2
      },
      {
        color: 'yellow',
        sort: 3
      }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    toView: 'aa',
    selectedMenuId: 1,
    total: {
      count: 0,
      money: 0
    }
    //添加
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
    // this.data.toView = 'red'
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
            dish.count += 1
            total.count += 1
            total.money += dish.price
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
            dish.count -= 1;
            total.count -= 1
            total.money -= dish.price
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
    })
  }
});
