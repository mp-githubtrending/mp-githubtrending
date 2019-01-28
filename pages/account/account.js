const cloudclient = require('../../utils/cloudclient.js')
const app = getApp()

Page({
  data: {
    owner: wx.getStorageSync("github-name") || '',
    list: [],
    repos: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  bindViewTap: function () {
    wx.navigateTo({
      url: '../settings/settings'
    })
  },

  loadHistory: function() {
    var self = this
    cloudclient.callFunction({type: 'history'}, function(d) {
      self.setData({list: d})
    })
  },

  loadMeta: function() {
    var self = this
    if (this.data.owner == "") {return}
    cloudclient.callFunction({ type: 'get', path: '/users/' + this.data.owner}, function(d){
      self.setData({meta: d})
    })
  },

  onClick(event) {
    var self = this;
    if (event.detail.index == 1 && this.data.repos.length == 0) {
      cloudclient.callFunction({
        type: 'repos',
        owner: self.data.owner,
      }, function (d) {
        self.setData({repos: d})
      })
    }
  },

  onLoad: function () {
    this.loadMeta()
    this.loadHistory()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function() {
    var sname = wx.getStorageSync("github-name")
    if (sname != this.data.owner) {
      this.setData({owner: sname, repos: []})
      this.onLoad()
    }
  }
})