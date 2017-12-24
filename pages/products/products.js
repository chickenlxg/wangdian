import WxParse from '../../wxParse/wxParse';
var app = getApp();

Page({
  data: {
    product: [],
    current: 1,
    indicatorDots: false,
  },
  currentchange(e) {
    this.setData({
      current: e.detail.current + 1
    });
  },
  onLoad(options) {
    const productId = options.id;
    var product = [];
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/product.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: productId,
        userID: app.globalData.userID
      },
      success: function (res) {
        product = res.data;
        that.setData({
          product: res.data,
          wxParseData: WxParse('html', product.goods_detail),
          cartNum: res.data.cartNum
        });
      }
    })
  },
  onShareAppMessage(event) {
    return {
      title: '商品页',
      desc: this.data.product.goods_name,
      path: '/products/products?id=' + this.data.product.id
    }
  },
  addCar() {
    this.setData({
      product: this.data.product,
      popDisplay: 'block',
      subButton: {
        disabled: 'disabled',
        class: 'disabled'
      },
      addButton: {
        disabled: '',
        class: ''
      },
      buyNum: 1,
      buyNumClass: '',
      totalStock: this.data.product.total_stock,
      oldStockNum: this.data.product.total_stock,
      goodsPrice: this.data.product.goods_price,
      oldGoodsPrice: this.data.product.goods_price
    });

  },
  closePop() {
    this.setData({
      popDisplay: 'none'
    });
  },
  addShopNum() {
    let buyNum = this.data.buyNum;
    const totalNum = this.data.totalStock;
    buyNum += 1;
    if (buyNum < totalNum && buyNum !== 1) {
      this.data.subButton.class = '';
      this.data.subButton.disabled = '';
    } else {
      this.data.addButton.class = 'disabled';
      this.data.addButton.disabled = 'disabled';
    }
    this.setData({
      buyNum,
      addButton: this.data.addButton,
      subButton: this.data.subButton
    });
  },
  subShopNum() {
    let buyNum = this.data.buyNum;
    const totalNum = this.data.totalStock;
    buyNum -= 1;

    if (buyNum < totalNum && buyNum !== 1) {
      this.data.addButton.class = '';
      this.data.addButton.disabled = '';
    } else {
      this.data.subButton.class = 'disabled';
      this.data.subButton.disabled = 'disabled';
    }

    this.setData({
      buyNum,
      addButton: this.data.addButton,
      subButton: this.data.subButton
    });
  },
  submitCart() {
    const data = {
      goods_id: this.data.product.id,
      goods_number: this.data.buyNum
    };
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/addcart.php',
      data: {
        user_id: app.globalData.userID,
        goods_id: this.data.product.id,
        goods_number: this.data.buyNum
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          popDisplay: 'none',
          cartNum: that.data.cartNum + that.data.buyNum,
          toast: {
            toastClass: 'yatoast',
            toastMessage: '商品已添加'
          }
        });
      }
    })
    setTimeout(() => {
      this.setData({
        toast: {
          toastClass: '',
          toastMessage: ''
        }
      });
    }, 2000);
  },
  navigateToCart() {
    wx.switchTab({
      url: '../cart/cart'
    });
  }
});
