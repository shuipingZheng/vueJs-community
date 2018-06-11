<template>
	<div class="message">
        <app-bar appBar="消息"></app-bar>

		<mu-list class="messageList">
			<mu-list-item :title='"新消息("+ hasnot_read_messages.length +")"' toggleNested :open="false" v-if="hasnot_read_messages" @click="onLogin()">
				<mu-list-item slot="nested" v-for="hasnot,index in hasnot_read_messages" :key="index" :title='hasnot.author.loginname +" 回复了你的话题 "+hasnot.topic.title' class="topicsList" >	
						       
			    </mu-list-item>
				
			</mu-list-item>
			<mu-divider/>
		</mu-list>

		<mu-list class="messageList">
			<mu-list-item :title='"过往消息("+ has_read_messages.length +")"' toggleNested :open="false" v-if="has_read_messages" @click="onLogin()">
				<mu-list-item slot="nested" v-for="has,index in has_read_messages" :key="index" :title='has.author.loginname +" 回复了你的话题 "+has.topic.title' class="topicsList">	
							       
			    </mu-list-item>
				
			</mu-list-item>
			<mu-divider/>
		</mu-list>
	</div>
</template>


<script>
import store from 'vuex'
import eventBus from '@/util/eventBus'
import appBar from '@/components/appBar'

	export default{
		name: 'message',
		data(){
			return {
				accesstoken: '',
				has_read_messages: [], //已读
				hasnot_read_messages: [] //未读
			}
		},
		components:{
			appBar
		},
		methods:{
			getData(){ //获取数据
				let self = this;

				this.$ajax.get('https://www.vue-js.com/api/v1/messages?accesstoken='+this.accesstoken)
						  .then(function(res){
						  	
						  	self.has_read_messages = res.data.data.has_read_messages;
						  	self.hasnot_read_messages = res.data.data.hasnot_read_messages;
						  })
						  .catch(function(){

						  })
			},
			onLogin(){
				
				if(this.accesstoken == "" || this.accesstoken == null){
					
					this.$router.push( {path: '/login'})
				}
			}
		},
		created(){

			let accesstoken = localStorage.getItem("accesstoken");
			if( accesstoken == null){
				this.$router.push({path:'/login'})
			}else{
				this.accesstoken = accesstoken;
				this.getData();
			}

			
		},
		mounted(){
			
			let self = this;

			eventBus.$on('login', function(msg){
			  	self.accesstoken = msg.accesstoken;
			  	self.getData();
			  	
			})
				
		}

	}
</script>

<style lang="scss">
	.message{
		background: #f0f0f0;
		position: fixed;
		top: 0;
		bottom: 40px;
		width: 100%;
		overflow: auto;

	}
	.subHeader{
		background: #f6f6f6;
	}
	.messageList{
		background: #ffffff;	
	}
</style>