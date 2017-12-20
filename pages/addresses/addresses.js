var app = getApp();
import tips from '../../lib/tips';
Page({
  data: {
    loading: true,
    addressesList: [],
    defaultId: 0,
    tipsData: {
      title: ''
    },
    orderSn: null,
    type: null
  },
  setDefaultStyle(list, id) {
    list.forEach((itm) => {
      if (itm) {
        itm.items.is_default = +itm.id === id;
        itm.items.iconType = itm.items.is_default ? 'success' : 'circle';
        if (itm.id == id) {
          itm.is_default = 1;
          itm.items.is_default = 'true';
        } else {
          itm.is_default = 0;
          itm.items.is_default = 'false';
        }
        itm.items.iconColor = itm.items.iconType === 'success' ? '#FF2D4B' : '';
      }
    });
  },
  goEdit(event) {
    const id = event.target.dataset.addressId;
    wx.navigateTo({
      url: `../address-edit/address-edit?id=${id}`
    });
  },
  delete(event) {
    const id = event.target.dataset.addressId;
    let addressList = this.data.addressesList;

    this.confirmToast(() => {
      var that = this;
      wx.request({
        url: app.serverURL + '/get/web/deleteAddress.php',
        header: {
          'content-type': 'application/json'
        },
        data: {
          checkedId: id
        },
        success: function (res) {

          if (res.statusCode === 200) {
            const defaultData = addressList.find(itm => itm.is_default === 1);
            if (+defaultData.id === +id && addressList.length > 1) {
              addressList[0].is_default = 1;
              addressList[0].items.is_default = 'true';
              wx.request({
                url: app.serverURL + '/get/web/setDefaultAddress.php',
                data: {
                  checkedId: addressList[0].id,
                  userID: app.globalData.userID
                },
                header: {
                  'content-type': 'application/json'
                }
              })
              addressList[0].items.iconType = 'success';
              addressList[0].items.iconColor = '#FF2D4B';
            }
            that.setData({
              addressesList: addressList.filter(itm => +itm.id !== +id)
            });
            wx.showToast({
              title: '成功',
              icon: 'success',
              duartion: '80000',
            });
          }
        },
      })
    });
  },
  setDefault(event) {
    const checkedId = +event.currentTarget.dataset.valueId || +event.detail.value;
    let setFlag = false;
    this.loadingToast();

    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/setDefaultAddress.php',
      data: {
        checkedId: checkedId,
        userID: app.globalData.userID
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          setFlag = true;
          that.setDefaultStyle(that.data.addressesList, checkedId);
          that.setData({ addressesList: that.data.addressesList });
        } else {
          setFlag = false;
        }
        if (setFlag) {
          wx.showToast({
            title: '设置成功!',
            icon: 'success'
          });
        } else {
        }
      },
    })
  },
  onLoad(option) {
    tips.toast(this.data.tipsData);
    const tipsData = {
      title: 'sku不足zz',
      duration: 2000,
      isHidden: false
    };
    this.setData({
      orderSn: option.orderSn,
      type: option.type,
      tipsData
    });
    setTimeout(() => {
      tipsData.isHidden = true;
      this.setData({
        tipsData
      });
    }, 3000);


    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/addressGet.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID
      },
      success: function (res) {
        if (res.data) {
          res.data.forEach((itm) => {
            itm.is_default *= 1;
            itm.items = {
              id: itm.id,
              is_default: itm.is_default ? 'ture' : 'false',
              isgroup: true,
              labelText: '设置为默认',
              iconType: itm.is_default ? 'success' : 'circle'
            };
            itm.items.iconColor = itm.items.iconType === 'success' ? '#FF2D4B' : '';
          });
          that.setData({
            addressesList: res.data,
            loading: false
          });
        } else {
          that.setData({
            addressesList: [],
            loading: false
          });
        }
      },
    })
  },
  confirmToast(callback) {
    wx.showModal({
      title: '提示框',
      content: '确定要删除吗？',
      showCancel: true,
      success: (res) => {
        if (res.confirm) callback();
      }
    });
  },
  loadingToast() {
    wx.showToast({
      title: '设置中，请稍后',
      icon: 'loading'
    });
  },
  changeAddress(event) {
    var that = this;
    const changeid = event.currentTarget.dataset.addressId;
    wx.request({
      url: app.serverURL + '/get/web/addressAlter.php',
      header: {
        'content-type': 'application/json'
      },
      data: {
        orderSn: that.data.orderSn,
        addressId: changeid
      },
      success: function (res) {
        var url = that.data.type == "order-detail" ? "../order-detail/order-detail?subOrderSn=" : '../settlement/settlement?orderSn=';
        wx.navigateTo({
          url: url + that.data.orderSn
        });
      }
    })
  }
});
