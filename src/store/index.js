import Vue from 'vue'
import Vuex from 'vuex'



Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    article: '', //文章
    loginname: '',
    accesstoken: '',
    showReplies: false, //显示评论
    collectTopics: [], //收藏话题
    collect: ''  //收藏主题变化
  },
  getters: {
    getArticle: state => state.article,
    getLoginname: state => state.loginname,
    getAccesstoken: state => state.accesstoken,
    getShowReplies: state => state.showReplies,
    getCollectTopics: state => state.collectTopics,
    getCollect: state => state.collect
  },
  mutations: {
    setArticle: (state,data) => state.article = data,
    setLoginname: (state,name) => state.loginname = name,
    setAccesstoken: (state,token) => state.accesstoken = token,
    setCollectTopics: (state,collectTopics) => state.collectTopics = collectTopics,
    setCollect: (state,collect) => state.collect = collect,
    setShowReplies: (state) => state.showReplies ? state.showReplies = false : state.showReplies = true
  },
  actions: {
    
  },

  modules: {
    
  }
})

export default store
