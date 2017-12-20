App({
  onLaunch: function () {
    wx.login({
      success: res => {
        
        if (res.code) {
          wx.request({
            url: this.serverURL + '/get/web/userinfo.php',
            data: {
              code: res.code
            },
            success: res => {
              console.log(res);
              this.globalData.userID = res.data;
              wx.request({
                url: this.serverURL + '/get/web/isUser.php',
                data: {
                  code: res.data
                },
                success: e => {
                  this.globalData.isUser = e.data;
                }
              });
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  serverURL: 'https://www.yueermusic.com',
  globalData: {
    userInfo: null,
    userID: null,
    isUser: null
  }
})
