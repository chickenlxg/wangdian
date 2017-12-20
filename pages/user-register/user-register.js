var app = getApp();
import tips from '../../lib/tips';
Page({
  data: {
    userInfo: {},
    name: '',
    mobile: '',
    idcard: '',
    city: '',
    age: '1990-01-01',
    company: '',
    cash: '',
    sickness: '',
    medicine1: '',
    medicine2: '',
    medicine3: '',
    healthmanager: '',
    goodsnum: '',
    errorpoint: '',
    tipsData: {
      title: '',
      isHidden: true
    },
    healthmanagerarray: ['冷建升', '候君霞', '王海江', '陈艳艳', '郑淑娟', '谷国荣', '卫四平', '路艳岭', '魏春艳', '王文涛'],
    index: '',
  },
  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },

  listenerNameInput(e) {
    this.data.name = e.detail.value;
  },
  listenerIdcardInput(e) {
    this.data.idcard = e.detail.value;
  },
  listenerPhoneInput(e) {
    this.data.mobile = e.detail.value;
  },
  listenerAgeInput: function (e) {
    this.setData({ age: e.detail.value }) 
    this.data.age = e.detail.value;
  },
  listenerCityInput: function (e) {
    this.data.city = e.detail.value;
  },
  listenerCompanyInput(e) {
    this.data.company = e.detail.value;
  },
  listenerCashInput(e) {
    this.data.cash = e.detail.value;
  },
  listenerSicknessInput(e) {
    this.data.sickness = e.detail.value;
  },
  listenerMedicine1Input: function (e) {
    this.data.medicine1 = e.detail.value;
  },
  listenerMedicine2Input: function (e) {
    this.data.medicine2 = e.detail.value;
  },
  listenerMedicine3Input: function (e) {
    this.data.medicine3 = e.detail.value;
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.healthmanagerarray[e.detail.value])
    this.setData({
      index: e.detail.value
    });
    this.data.healthmanager = this.data.healthmanagerarray[e.detail.value];
  },
  listenerGoodsnumInput: function (e) {
    this.data.goodsnum = e.detail.value;
  },
  listenerErrorpointInput: function (e) {
    this.data.errorpoint = e.detail.value;
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

  submitBtn() {
    const that = this;
    if (!this.data.name) { that.showToast('真实姓名不能为空'); return; }
    if (!this.data.idcard) { that.showToast('身份证号不能为空'); return; }
    // if (!/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(this.data.idcard)) { that.showToast('身份证号格式有误，请重新输入'); return; }
    if (!this.data.age) { that.showToast('出生年月不能为空'); return; }
    if (!this.data.mobile) { that.showToast('手机号不能为空'); return; }
    if (!/^1[3|4|5|7|8]\d{9}$/.test(this.data.mobile)) { that.showToast('手机格式有误，请重新输入'); return; }
    
    wx.request({
      url: app.serverURL + '/get/web/user-register.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        name: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        real_name: this.data.name,
        age: this.data.age,
        idcard: this.data.idcard,
        mobile: this.data.mobile,
        city: this.data.city,
        company: this.data.company,
        cash: this.data.cash,
        sickness: this.data.sickness,
        medicine1: this.data.medicine1,
        medicine2: this.data.medicine2,
        medicine3: this.data.medicine3,
        healthmanager: this.data.healthmanager,
        goodsnum: this.data.goodsnum,
        errorpoint: this.data.errorpoint
      },
      success: res => {
        app.globalData.isUser = '1';
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1200
        });
      },
    })
  },
});
