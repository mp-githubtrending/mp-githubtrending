const util = require('../../../utils/util.js')
import Toast from '../../../third-party/vant-weapp/toast/toast';
Component({
  properties: {
    md: {
      type: String,
      value: ''
    },
    owner: {
      type: String,
      value: ''
    },
    repo: {
      type: String,
      value: '' 
    }
  },

  data: {

  },

  methods: {
    onMDClick(e) {
      console.log(e)
      var clickurl = e.detail.currentTarget.dataset.text
      var text = 'No anchorTargetText found'
      if (e.detail._relatedInfo) {
        text = e.detail._relatedInfo.anchorTargetText
      } 
      console.log("onMDClick url:", clickurl, text)
      var filepath = clickurl
      var owner = this.data.owner
      var repo = this.data.repo
      if (clickurl.startsWith('http') && !util.isGitHubPage(clickurl)) {
        util.copyOnlyText(clickurl)
        return
      }

      if (util.isGitHubPage(clickurl)) {
        var [tmpowner, tmprepo, tmpfilepath] = util.parseGitHub(clickurl)
        console.log("parseGitHub url:", tmpowner, tmprepo, tmpfilepath)
        owner = tmpowner
        repo = tmprepo
        filepath = tmpfilepath
        console.log("change owner repo:", owner, repo, filepath)
      }
      if (filepath == "" && repo == "") {
        wx.navigateTo({ url: '/pages/account/account?owner=' + owner})
      }
      else if (filepath == "") {
        wx.navigateTo({url: '/pages/readme/readme?repo='+owner+" / "+repo})
      }
      else if (filepath.endsWith('.md') || util.isCodeFile(filepath)) {
        wx.navigateTo({
          url: '/pages/gitfile/gitfile?file=' + filepath + '&owner=' + owner + '&repo=' + repo,
        })
      } else {
        util.copyOnlyText(clickurl)
      }
    },
  }
})
