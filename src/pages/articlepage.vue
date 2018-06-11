<template>
	
	<div class="articlePage">
		
		<header-back :titleName="article.title"></header-back>
		<div class="articleContent" >
			<div class="articleInfo" v-if="article.author">
				<img :src="article.author.avatar_url">
				<div class="infoBox">
					<span class="authorName">{{article.author.loginname}}</span><br>
					<span >发布于:{{article.create_at | formatDate}}</span>
					<span>{{article.visit_count}}次浏览 </span>-
					<span>来自:{{article.tab | switchName}}</span>
				</div>
			</div>

			<!-- <mu-list>
				
				<mu-list-item>
			      <mu-avatar :src="article.author.avatar_url" slot="leftAvatar"/>
			      <span slot="title">作者: </span>
			      <span slot="describeText"> </span>
			    </mu-list-item>
			</mu-list> -->

			<!-- <mu-list>
				<mu-icon-button icon="favorites"/>
				<div>收藏主题</div>
				<mu-raised-button class="demo-raised-button" label="收藏主题" icon="favorites" iconClass="collect_topics"/>
			</mu-list> -->

			<div class="articleBody" v-html="article.content">
				
			</div>
			<!-- 评论 -->
			<!-- <comment :replies="article.replies"></comment> -->
		</div>

		<div class="articleFooter">

			<span class="articleFooterBtn" @click="share()">
				<mu-icon slot="left" value="share"/>
				<span>分享</span>
			</span>
			<span class="articleFooterBtn" @click="onCollect()">
				<!-- <mu-checkbox :label="collectText" v-model="collect" :nativeValue="article.id" class="demo-checkbox collectBtn" uncheckIcon="favorite_border" checkedIcon="favorite"/> -->
				<mu-icon slot="left" :value="collect ? 'favorite' : 'favorite_border'"/>
				<span v-if="collect">已收藏</span>
				<span v-else>收藏</span>
			</span>

			<span class="articleFooterBtn" @click="replies()">
				<mu-icon slot="left" value="message"/>
				<span>{{article.reply_count}}</span>
			</span>
		</div>

		<mu-dialog :open="dialog" title="温馨提示" @close="onClose">
	        开发中...
	        <mu-flat-button slot="actions" primary @click="onClose" label="确定"/>
	    </mu-dialog>

		<replies :replies="article.replies" v-if="showReplies"></replies>


	</div>
</template>

<script>
import store from 'vuex'
import headerBack from '@/components/headerBack'
import replies from '@/pages/replies'
import eventBus from '@/util/eventBus'

	export default{
		name: 'articlePage',
		data(){
			return {
				dialog: false,
				article: [],
				collect: false, //收藏
				collectType: 'collect'   //de_collect 取消


			}
		},
		components:{
			headerBack,
			replies
		},
		methods: {
			getData(){
				let self = this;
				self.collect = false;

				this.$ajax.get('https://www.vue-js.com/api/v1/topic/'+ this.$route.query.aid)
						  .then(function(res){
						  	self.article = res.data.data;
						  	if(self.loginname){ //登陆后遍历
					
								self.getCollect();
							}

						  })
						  .catch(function(error){

						  })

			},
			replies(){  //评论
				
				if(this.accesstoken == null || this.accesstoken == ""){

					this.$router.push({path: '/login'})
					return false;
				}

				this.$store.commit('setShowReplies')
			},
			onCollect(){  //收藏切换

				let self = this;

				if(this.accesstoken == null || this.accesstoken == ""){

					this.$router.push({path: '/login'})
					return false;
				}

				if(this.collect){

            		this.collectType = "de_collect";
            		this.collectText = "收藏";

            	}else{
            		
            		this.collectType = "collect";
            		this.collectText = "已收藏";
            	}

				this.$ajax.post('https://www.vue-js.com/api/v1/topic/'+ this.collectType,{accesstoken: this.accesstoken, topic_id:this.$route.query.aid })
						  .then(function(res){
						  	if(res.data.success){
						  		self.collect = !self.collect;

								//触发收藏主题
						  		eventBus.$emit('collect',self.collect);
						  		

						  	}
						  })
						  .catch(function(error){

						  })
			}, 
			share(){
				this.dialog = true;
			},
			onClose(){
				this.dialog = false;
			},
			getCollect(){//获取登录用户收藏的主题
				let self = this;
				this.$ajax.get('https://www.vue-js.com/api/v1/user/'+this.loginname)
						  .then(function(res){
						  	let collect_topics = res.data.data.collect_topics;
						  	collect_topics.find(function(item){
						  		
						  		if(self.article.id === item.id){

						  			self.collect = true;
					
						  		}

						  	})

						  })
						  .catch(function(){

						  })
			}
			
		},
		computed: {
			showReplies(){
				return this.$store.getters.getShowReplies;
			},
			accesstoken(){
				return this.$store.getters.getAccesstoken;
			},
			loginname(){
				return this.$store.getters.getLoginname;
			}
		},
		created(){
			
			//文章数据
			this.getData();
			
		},
		mounted(){
			let self = this;
			//接收评论成功触发；
			eventBus.$on('replies',function(msg){
		    	self.getData();
		  	})
			
		},
		watch: {
			'$route'(to, from){
				if(to.query.aid){
					this.getData();
					
				}
            }/*,
            collect(cval){
            	if(cval){
            		this.collectType = "collect";
            		this.collectText = "已收藏"
            		this.onCollect();
            	}else{
            		this.collectType = "de_collect";
            		this.collectText = "收藏"
            		this.onCollect();
            	}
            }*/
			
		}
	}
</script>

<style lang="scss">
	.articlePage{
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    background: #fff;
	    top: 0;
	    z-index: 999;
	}

	

	.articleContent{
		position: fixed;
		width: 100%;
		top: 56px;
		bottom: 4rem;
		padding: 1rem 0rem;
		overflow-x: hidden;
		overflow-y: auto;

		img{
			max-width: 100%;
		}

		.collect_topics{
			color: red;
		}

		.articleInfo{
			padding: 0 1rem 1rem;
			display: flex;
			border-bottom: 1px solid #f0f0f0;

			img{
				width: 3.6rem;
				height: 3.6rem;
				margin-right: 1rem;
			}

			.infoBox{
				flex: 1 1 auto;

				span{
					line-height: 1.3rem;

					&.authorName{
						font-size: 1.6rem;
						font-weight: bold;
					}
				}

			}

			
		}

		.articleBody{
			padding: 0 1rem;
		}
	}


	.articleFooter{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 3.6rem;
		border-top: 1px solid #f0f0f0;
		display: flex;



		.articleFooterBtn{
			flex: 1 1 auto;
			display: flex;
			align-items: center;
       		justify-content: center;
       		cursor: pointer;

			i,span{
				
				height: 3.6rem;
				line-height: 3.6rem;
			}

			span{
				font-size: 1.6rem;
			}
		}
	}
	.collectBtn{

		.mu-checkbox-icon{
			margin-right: 0px;
			height: 40px;
		}
	}
</style>