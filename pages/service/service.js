// pages/service/service.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userIntegral: '',
    sign: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.request({
      url: app.serverURL + '/get/web/sign.php',
      data: {
        userID: app.globalData.userID
      },
      success: function (res) {
        that.setData({
          sign: res.data
        })
      }
    });

  },

  signbtn: function () {
    const that = this;
    wx.request({
      url: app.serverURL + '/get/web/integralAdd.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        type: 'sign'
      },
      success: function (res) {
        that.setData({
          sign: '1'
        })
      }
    });

    wx.showToast({
      title: '签到成功',
      icon: 'success',
      duration: 1000
    })
  },

  scanCode: function () {
    const that = this;
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        if (result == 'jinnuotianyifu2017dahuiqiandao') {
          wx.request({
            url: app.serverURL + '/get/web/integralAdd.php',
            header: {
              'content-type': 'application/json'
            },
            data: {
              userID: app.globalData.userID,
              type: 'qiandao'
            },
          });

          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 1000
          })
          return;
        };

        if (result == 'jinnuotianyifu2017dahuiqiandao30') {
          wx.request({
            url: app.serverURL + '/get/web/integralAdd.php',
            header: {
              'content-type': 'application/json'
            },
            data: {
              userID: app.globalData.userID,
              type: 'qiandao30'
            },
          });

          wx.showToast({
            title: '迟到签到',
            icon: 'success',
            duration: 1000
          })
          return;
        };

        wx.showToast({
          title: '扫码有误',
          icon: 'loading',
          duration: 1000
        });

      }
    })
  }
})