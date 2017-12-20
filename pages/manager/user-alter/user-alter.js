var app = getApp();
import tips from '../../../lib/tips';
Page({
  data: {
    userInfo: {},
    search: '0',
    age: '',
    username: '',
    tipsData: {
      title: '',
      isHidden: true
    },
    healthmanagerarray: ['冷建升', '候君霞', '王海江', '陈艳艳', '郑淑娟', '谷国荣', '卫四平', '路艳岭', '魏春艳', '王文涛'],
    index: '',
  },
  onLoad() {

  },

  listenerUsernameInput(e) {
    this.data.username = e.detail.value;
  },
  listenerAgeInput: function (e) {
    this.setData({ age: e.detail.value })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },

  showToast(title, duartion) {
    const that = this;
    const tipsData = {
      title: title || '',
      duartion: duartion || 2000,
      isHidden: false
    };
    tips.toast(that.data.tipsData);
    that.setData({
      tipsData
    });
    setTimeout(() => {
      tipsData.isHidden = true;
      that.setData({
        tipsData
      });
    }, tipsData.duartion);
  },

  searchBtn() {
    const that = this;
    if (!this.data.username) { that.showToast('请输入会员姓名'); return; };

    wx.request({
      url: app.serverURL + '/get/web/userSearch.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        username: this.data.username,
      },
      success: res => {

        if(!res.data){
          that.showToast('用户不存在');
          that.setData({
            search: '0'
          });
          return;
        }

        that.setData({
          userInfo: res.data,
          search: '1'
        });

        if (res.data.healthmanager != '') {
          that.setData({
            index: res.data.healthmanager
          });
        }

        if (res.data.age != '') {
          that.setData({
            age: res.data.age
          });
        }
        
        console.log(that.data.userInfo);
      },
    })
  },

  submitBtn: function (e)  {
    const that = this;
    if (!e.detail.value.name) { that.showToast('真实姓名不能为空'); return; }
    if (!e.detail.value.idcard) { that.showToast('身份证号不能为空'); return; }
    if (!/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(e.detail.value.idcard)) { that.showToast('身份证号格式有误，请重新输入'); return; }
    if (!e.detail.value.age) { that.showToast('出生年月不能为空'); return; }
    if (!e.detail.value.mobile) { that.showToast('手机号不能为空'); return; }
    if (!/^1[3|4|5|7|8]\d{9}$/.test(e.detail.value.mobile)) { that.showToast('手机格式有误，请重新输入'); return; }

    wx.request({
      url: app.serverURL + '/get/web/user-alter.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        real_name: e.detail.value.name,
        age: e.detail.value.age,
        idcard: e.detail.value.idcard,
        mobile: e.detail.value.mobile,
        city: e.detail.value.city,
        company: e.detail.value.company,
        cash: e.detail.value.cash,
        sickness: e.detail.value.sickness,
        medicine1: e.detail.value.medicine1,
        medicine2: e.detail.value.medicine2,
        medicine3: e.detail.value.medicine3,
        healthmanager: e.detail.value.healthmanager,
        goodsnum: e.detail.value.goodsnum,
        errorpoint: e.detail.value.errorpoint
      },
      success: res => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1200
        });
      },
    })
  },
});
