var app = getApp();
Page({
  data: {
    items: {
      labelText: '已阅读并同意',
      iconType: 'circle',
      is_default: false
    }
  },
  onLoad() {
    const src = app.globalData.type === 'success' ? 'success.png' : 'fail.png';
    const typeText = app.globalData.type === 'success' ? '支付成功' : '支付失败';
    const type = app.globalData.type === 'success' ? 1 : 0;
    this.setData({
      price: app.globalData.price,
      src,
      typeText,
      type
    });
  }
});
