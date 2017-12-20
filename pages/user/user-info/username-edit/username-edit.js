const app = getApp();

Page({
  data: {},
  onLoad() {
    this.setData({
      username: app.globalData.userInfo.nickName
    });
  },
  clearText() {
    this.setData({
      username: '',
      display: 'display-none',
      disabled: true,
      class: 'disabled'
    });
  },
  changeStatus(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        display: '',
        disabled: false,
        class: '',
        username: e.detail.value
      });
    } else {
      this.setData({
        display: 'display-none',
        disabled: true,
        class: 'disabled'
      });
    }
  },
  updataInfo(e) {
    const data = {
      nickname: e.currentTarget.dataset.nickname
    };

    var that = this;
    wx.request({
      url: app.serverURL + '/get/namechange.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.userInfo.nickName = e.currentTarget.dataset.nickname;
        wx.navigateTo({
          url: '../user-info'
        });
      },
    })
  }
});
