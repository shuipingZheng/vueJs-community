<template>
	<div class="person">
		
		<app-bar appBar="个人中心"></app-bar>

		<mu-list>
			<div class="avatar">
				<img  :src="user.avatar_url" >
				<div class="avatarInfo"  v-if="!user.loginname">
					<span @click="onLogin()">请先登录</span>
				</div>
				<div class="avatarInfo" v-if="user.loginname">
					<span class="name">{{user.loginname}}</span>
					<span>积分:{{user.score || 0}}</span>
					<span>创建于{{user.create_at | formatDate}}</span>
				</div>
			</div>
			<mu-list-item title="收藏的话题" toggleNested :open="false" v-if="user.collect_topics" @click="onLogin()">
				<mu-list-item slot="nested" v-for="collect in user.collect_topics" :key="collect.id" :title="collect.title" class="topicsList" @click="openPage(collect.id)">	
					<mu-icon slot="left" value="arrow_right"/>		       
			    </mu-list-item>
				<span slot="right" class="numClass">{{user.collect_topics.length}}</span>
			</mu-list-item>
			<mu-divider/>



			<mu-list-item title="最近参与的话题" toggleNested :open="false" v-if="user.recent_replies" @click="onLogin()">
				<mu-list-item slot="nested" v-for="replies in user.recent_replies" :key="replies.id" :title="replies.title" class="topicsList" @click="openPage(replies.id)">	
					<mu-icon slot="left" value="arrow_right" />	
			    </mu-list-item>
				<span slot="right" class="numClass">{{user.recent_replies.length}}</span>
			</mu-list-item>
			<mu-divider/>
						       

			<mu-list-item title="最近创建的话题" toggleNested :open="false" v-if="user.recent_topics" @click="onLogin()">
				<mu-list-item slot="nested" v-for="topics in user.recent_topics" :key="topics.id" :title="topics.title" class="topicsList" @click="openPage(topics.id)">	
			    	<mu-icon slot="left" value="arrow_right"/>	
			    </mu-list-item>
				<span slot="right" class="numClass">{{user.recent_topics.length}}</span>
			</mu-list-item>
			<mu-divider/>
		</mu-list>

		
	</div>
</template>

<script>
import store from 'vuex'
import appBar from '@/components/appBar'
import eventBus from '@/util/eventBus'
	export default{
		name: 'person',
		data(){
			return {
				loginname: '',
				user: {
					avatar_url: './static/images/logo.png',
					loginname: '',
					score: 0,
					create_at: '',
					collect_topics: [],
					recent_replies: [],
					recent_topics: []
				}
				
			}
		},
		components:{
			appBar
		},
		methods: {
			getData(){
				let self = this;
				this.$ajax.get('https://www.vue-js.com/api/v1/user/'+this.loginname)
						  .then(function(res){
						  	self.user = res.data.data
						  	this.$store.commit('setLoginname',res.data.data.loginname)
						  })
						  .catch(function(){

						  })
			},
			openPage(id){
				this.$router.push( {path: '/articlePage',  query: { aid: id }})
			},
			onLogin(){
				
				if(this.loginname == "" || this.loginname == null){
					
					this.$router.push( {path: '/login'})
				}
			}
			
		},

		created(){
			let loginname = localStorage.getItem('loginname');

			if(loginname != null){
				this.loginname = loginname;
				this.getData();
			}
		},
		mounted(){
			
			let self = this;

			//接收收藏、取消收藏触发；
			eventBus.$on('collect', function(msg){
			    self.getData();
			})

			eventBus.$on('login', function(msg){
			  	self.loginname = msg.loginname;
			  	self.getData();
			  	
			})
				
		}

	}
</script>

<style lang="scss">
	.person{
		position: fixed;
		width: 100%;
		height: 100%;
	}
	.person-list{
		background: #ffffff;
		margin-bottom: 1.5rem;
	}
	.avatar{
		display: flex;
		padding: 0rem .5rem; 

		img{

			width: 5rem;
			height: 5rem;
			margin-right: 1rem;


		}
		.avatarInfo{

			flex: 1 1 auto;

			span{

				display: block;
				font-size: 1.2rem;

				&.name{
					font-size: 1.4rem;
					font-weight: bold;
				}
			}
			
		}
	}

	.topicsList{
		border-bottom: 1px solid #f0f0f0;

		&:last-child{
			border-bottom: none;
		}
	}
	.numClass{
		position: absolute;
		padding: .25rem .5rem;
		background: #f0f0f0;
		border-radius: 40%;
		right: 4rem;
	}
</style>