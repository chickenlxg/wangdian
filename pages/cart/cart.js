var app = getApp();

Page({
  data: {
    loading: true,
    cartList: [],
    totalNumber: 0,
    totalPrice: 0,
    checkedStatus: true,
    buyNumber: 0,
    buyPrice: 0,
    orderSn: null
  },
  onShow() {
    if (app.globalData.isUser == '0') {
      wx.navigateTo({
        url: '../user-register/user-register'
      });
    }
    var that = this;
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
        var totalNumber = 0;
        var totalPrice = 0;
        var buyNumber = 0;
        var buyPrice = 0;
        var masterbuyPrice = 0;
        var mastertotalPrice = 0;
        res.data.forEach(item => {
          item.PNUM = 1 * item.PNUM;
          item.status = 1 * item.status;
          if (!item.status) {
            that.setData({ checkedStatus: false });
          } else {
            buyNumber += item.PNUM;
            buyPrice += item.PNUM * item.goods_price;
            masterbuyPrice += item.PNUM * item.market_price;
          }
          totalNumber += item.PNUM;
          totalPrice += item.PNUM * item.goods_price;
          mastertotalPrice += item.PNUM * item.market_price;
          if (item.PNUM == item.total_stock) {
            item.plus_class = "disabled";
          } else {
            item.plus_class = "";
          }
          if (item.PNUM == 1) {
            item.decr_class = "disabled";
          } else {
            item.decr_class = "";
          }
        })
        that.setData({
          cartList: res.data,
          loading: false,
          totalNumber: totalNumber,
          totalPrice: totalPrice,
          mastertotalPrice: mastertotalPrice,
          buyNumber: buyNumber,
          buyPrice: buyPrice,
          masterbuyPrice: masterbuyPrice
        });
      },
    });
    console.log(this.data.cartList);
  },

  selectProduct(event) {
    var cartId = event.currentTarget.dataset.id;
    var checkedStatus = event.currentTarget.dataset.checkedStatus;
    var totalNumber = 0;
    var totalPrice = 0;
    var buyNumber = 0;
    var buyPrice = 0;
    var masterbuyPrice = 0;
    var mastertotalPrice = 0;
    var id = [];
    checkedStatus = checkedStatus === true;
    var changeStatus = true;
    this.data.cartList.forEach(item => {
      if (item.pid == cartId || cartId == 0) {
        if (item.status != !checkedStatus) {
          id.push(item.pid);
        }
        item.status = cartId == 0 ? !checkedStatus : !item.status;
        wx.request({
          url: app.serverURL + '/get/web/changeSelect.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            id: item.pid,
            status: item.status
          }
        })
      }
      if (!item.status) {
        changeStatus = false;
      } else {
        buyNumber += item.PNUM;
        buyPrice += item.PNUM * item.goods_price;
        masterbuyPrice += item.PNUM * item.market_price;
      }
      totalNumber += item.PNUM;
      totalPrice += item.PNUM * item.goods_price;
      mastertotalPrice += item.PNUM * item.market_price;
    });
    changeStatus = cartId == 0 ? !checkedStatus : changeStatus;
    this.setData({
      cartList: this.data.cartList,
      checkedStatus: changeStatus,
      totalNumber: totalNumber,
      totalPrice: totalPrice,
      mastertotalPrice: mastertotalPrice,
      buyNumber: buyNumber,
      buyPrice: buyPrice,
      masterbuyPrice: masterbuyPrice
    });
  },
  // 改变商品数量
  changeNumber(event) {
    var cartId = event.currentTarget.dataset.id;
    var optType = event.currentTarget.dataset.type;
    var totalNumber = 0;
    var totalPrice = 0;
    var buyNumber = 0;
    var buyPrice = 0;
    var masterbuyPrice = 0;
    var mastertotalPrice = 0;
    this.data.cartList.forEach(item => {
      if (item.pid == cartId) {
        if (optType == 'plus') {
          if (item.PNUM == item.total_stock  ) {
            this.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '该宝贝不能购买更多哦'
              }
            });
            setTimeout(() => {
              this.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                }
              });
            }, 2000);
          } else {
            item.PNUM++;
          }

        } else {

          if (item.PNUM <= 1) {
            this.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '亲，不能再减少了哦'
              }
            });
            setTimeout(() => {
              this.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                }
              });
            }, 2000);
          } else {
            item.PNUM--;
          }
        }
        if (item.PNUM == item.total_stock) {
          item.plus_class = "disabled";
        } else {
          item.plus_class = "";
        }
        if (item.PNUM == 1) {
          item.decr_class = "disabled";
        } else {
          item.decr_class = "";
        }
        
        wx.request({
          url: app.serverURL + '/get/web/productNumChange.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            id: cartId,
            productNum: item.PNUM
          }
        })
      }

      if (!item.status) {

      } else {
        buyNumber += item.PNUM;
        buyPrice += item.PNUM * item.goods_price;
        masterbuyPrice += item.PNUM * item.market_price;
      }
      totalNumber += item.PNUM;
      totalPrice += item.PNUM * item.goods_price;
      mastertotalPrice += item.PNUM * item.market_price;
    });
    this.setData({
      cartList: this.data.cartList,
      totalNumber: totalNumber,
      totalPrice: totalPrice,
      mastertotalPrice: mastertotalPrice,
      buyNumber: buyNumber,
      buyPrice: buyPrice,
      masterbuyPrice: masterbuyPrice,
    });
  },
  // 去结算页面
  toSettlement() {
    if (this.data.buyNumber == 0) {
      this.setData({
        toast: {
          toastClass: 'yatoast',
          toastMessage: '亲，您还未勾选商品'
        }
      });
      setTimeout(() => {
        this.setData({
          toast: {
            toastClass: '',
            toastMessage: ''
          }
        });
      }, 2000);
    } else {
      var that = this;
      wx.request({
        url: app.serverURL + '/get/web/orders.php',
        header: {
          'content-type': 'application/json'
        },
        data: {
          userID: app.globalData.userID,
          totalPrice: this.data.buyPrice,
          mastertotalPrice: this.data.masterbuyPrice
        },
        success: function (res) {

          //添加订单号
          that.data.cartList.forEach(item => {
            if (item.status == 1) {
              wx.request({
                url: app.serverURL + '/get/web/cartOrderSnAdd.php',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  id: item.pid,
                  market_price: item.market_price,
                  orderSn: res.data,
                  pid: item.id,
                  sold_count: item.sold_count,
                  total_stock: item.total_stock,
                  PNUM: item.PNUM
                }
              })
            }
          });

          if (that.data.masterbuyPrice != '0' && that.data.buyPrice != '0') {
            wx.navigateTo({
              url: '../orders/orders?t=待付款'
            });
          } 
          
          if (that.data.masterbuyPrice == '0' && that.data.buyPrice != '0') {
            wx.navigateTo({
              url: '../settlement/settlement?orderSn=' + res.data
            });
          }

          if (that.data.masterbuyPrice != '0' && that.data.buyPrice == '0') {
            wx.navigateTo({
              url: '../settlement/settlement?orderSn=M' + res.data
            });
          }
        }
      })
    }
  },
  // 去除购物车物品
  delProduct(event) {
    var that = this;
    wx.showModal({
      content: '你确定在购物车中删除该商品',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }
        var id = event.currentTarget.dataset.id;
        var cartList = this.data.cartList;
        var totalNumber = 0;
        var totalPrice = 0;
        var buyNumber = 0;
        var buyPrice = 0;
        var masterbuyPrice = 0;
        var mastertotalPrice = 0;
        var delKey = 0;
        cartList.forEach((item, key) => {
          if (item.pid == id) {
            delKey = key;
          } else {
            if (!item.status) {

            } else {
              buyNumber += item.PNUM;
              buyPrice += item.PNUM * item.goods_price;
              masterbuyPrice += item.PNUM * item.market_price;
            }
            totalNumber += item.PNUM;
            totalPrice += item.PNUM * item.goods_price;
            mastertotalPrice += item.PNUM * item.market_price;
          }
        });
        cartList.splice(delKey, 1);

        //删除购物车信息
        wx.request({
          url: app.serverURL + '/get/web/cartDel.php',
          header: {
            'content-type': 'application/json'
          },
          data: {
            id: id
          },
          success: function (res) {
            if (res.statusCode == 200) {
              that.setData({
                cartList: cartList,
                totalNumber: totalNumber,
                totalPrice: totalPrice,
                mastertotalPrice: mastertotalPrice,
                buyNumber: buyNumber,
                buyPrice: buyPrice,
                masterbuyPrice: masterbuyPrice,
              });
            }
          }
        })
      }
    });
  },
  navigateTo() {
    wx.switchTab({
      url: '../home/home'
    });
  }
});
