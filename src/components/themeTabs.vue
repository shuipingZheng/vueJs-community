<template>
  <div id="themeTabs">
      <div class="fixed">
        <mu-appbar title="VueJs社区" >
          <mu-avatar src="" slot="leftAvatar"/>
          <mu-icon slot="right" value="add" @click="add"/>
        </mu-appbar>

        <mu-tabs :value="activeTab" @change="handleTabChange">
          <mu-tab  v-for="theme in themeList" :key="theme.id" :value="theme.id" :title="theme.name" @active="handleActive"/>
          <!-- <mu-tab value="tab2" title="TAB TWO"/>
          <mu-tab value="tab3" @active="handleActive" title="TAB ACTIVE"/> -->
        </mu-tabs>
      </div>

      <div class="fixedContent" ref ="theme">
        <div v-for="theme in themeList"  v-if="activeTab === theme.id">
          <mu-list >
            <mu-list-item  v-for="item, index in itemList[activeTab].data" :key="index" :title="item.title" @click="openPage(item.id)">
              <mu-avatar :src="item.author.avatar_url" slot="leftAvatar"/>
                <span slot="describe">
                  <mu-badge v-if="item.top" content="置顶" slot="after"  badgeClass="topColor"/>
                  <mu-badge v-else-if="item.good" content="精华" slot="after" badgeClass="badgeColor"/>
                  <mu-badge v-else-if="item.tab === 'weex'" content="weex" slot="after" badgeClass="badgeColor"/>
                  <mu-badge v-else-if="item.tab === 'share'" content="分享" slot="after" badgeClass="badgeColor"/>
                  <mu-badge v-else-if="item.tab === 'ask'" content="问答" slot="after" badgeClass="badgeColor"/>
                  <mu-badge v-else-if="item.tab === 'job'" content="招聘" slot="after" badgeClass="badgeColor"/>
                  <!-- <span class="loginname">{{item.author.loginname}}</span>  -->
                  <span title="回复数" icon="home">{{item.reply_count}}</span>/<span title="访问数">{{item.visit_count}}</span> 
                  <span></span>
                  
                </span>

                <span slot="right">
                  {{item.create_at | formatDate }}
                </span>

              </mu-list-item>
              <mu-divider/>

            </mu-list>
            <div v-show="!itemList[activeTab].More" class="noMore">没有更多~</div>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
        </div>
      </div>

    

    <!-- 进度条 -->
    <div class="lineProgress" v-show="lineProgress">
      <mu-circular-progress :size="60" :strokeWidth="5"/>
    </div>


    <mu-dialog :open="dialog" title="温馨提示" @close="close">
        请先登录
        <mu-flat-button slot="actions" @click="close" primary label="取消"/>
        <mu-flat-button slot="actions" primary @click="onConfirm" label="确定"/>
    </mu-dialog>

  </div>
</template>

<script>
import store from 'vuex'
import eventBus from '@/util/eventBus'

export default {
  name: 'themeTabs',
  data () {
    return {
      dialog: false,
      limit: 15, //每页主题量
      itemList: {
        'all': {
          data: [],
          pageNum: 1,
          More: true
        },
        'good': {
          data: [],
          pageNum: 1,
          More: true
        },
        'weex': {
          data: [],
          pageNum: 1,
          More: true
        },
        'share': {
          data: [],
          pageNum: 1,
          More: true
        },
        'ask': {
          data: [],
          pageNum: 1,
          More: true
        },
        'job': {
          data: [],
          pageNum: 1,
          More: true
        }
      },
      activeTab: 'all',
      lineProgress: false,
      themeList: [{
        name: '全部',
        id: 'all'
      },{
        name: '精华',
        id: 'good'
      },{
        name: 'weex',
        id: 'weex'
      },{
        name: '分享',
        id: 'share'
      },{
        name: '问答',
        id: 'ask'
      },{
        name: '招聘',
        id: 'job'
      }],
      loading: false,
      scroller: null
    }
  },
  mounted () {
    this.scroller = this.$refs.theme //监听滚动的元素
    let self = this;
    eventBus.$on("publish",function(msg){
        
        self.activeTab = msg;
        self.itemList[msg].pageNum = 1;
        self.getData();
      
    })
  },
  methods: {
    add(){
      if(this.accesstoken==null || this.accesstoken==""){
        this.dialog = true;
      }else{
        this.$router.push({path:'/add'})
      }
    },
    close() {
        this.dialog = false
    },
    onConfirm(){
      this.dialog = false;
      this.$router.push( {path: '/login'})
    },
    handleTabChange (val) {
      this.activeTab = val;
  
    },
    handleActive () {

      let len = this.itemList[this.activeTab].data.length;

      if( len==0 ){
        this.getData();
      }
      
      
    },
    loadMore (){
      if(this.itemList[this.activeTab].More){
        this.loading = true
        this.itemList[this.activeTab].pageNum++;
        this.getData();
      }
      
    },
    getData (){

      let self = this;
      this.lineProgress = true;
      this.$ajax.get('https://www.vue-js.com/api/v1/topics',{ params: { tab : this.activeTab, page: this.itemList[this.activeTab].pageNum, limit: this.limit}})
                .then(function(res){
                 
                  self.loading = false;
                  self.lineProgress = false;
                  if(res.data.data.length == 0){

                    self.itemList[self.activeTab].More = false
                    return false;
                  }else if( res.data.data.length < self.limit ){
                    
                    self.itemList[self.activeTab].More = false
                  }
                  self.itemList[self.activeTab].data = self.itemList[self.activeTab].data.concat(res.data.data) 
                  
                })
                .catch(function(){

                })
    },
    openPage (id){
      this.$router.push( {path: '/articlePage',  query: { aid: id }})
    }
  },
  computed: {
    accesstoken(){
      return this.$store.getters.getAccesstoken;
    }
  },
  created(){
    this.getData();
  }
}
</script>

<style lang="scss">
.mu-item-title{
  word-wrap: break-word; 
  word-break: normal; 
  font-weight: 500;
}
.loginname{
  color: #323232;
  margin-right: 1rem;
}
.topColor{
  background: #eda047;
  color: #ffffff;
}
.badgeColor{
  background: #369219;
  color: #ffffff;
}
.lineProgress{
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
.fixed{
  position: fixed;
  top: 0;
  width: 100%;

}
.fixedContent{
  position: fixed;
  top: 104px;
  bottom: 40px;
  width: 100%;
  overflow:auto;

}
.noMore{
  text-align: center;
  color: #ccc;
  height: 3rem;
  line-height: 3rem;
  margin-bottom: 1rem;
}
</style>