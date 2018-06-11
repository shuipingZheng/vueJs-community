<template>
	<div class="settings">
		<app-bar appBar="设置"></app-bar>
		<div class="settingsContent">
			<mu-list>
				<mu-list-item title="关于" class="listItem">
									
				</mu-list-item>
				<mu-list-item title="帮助与反馈" class="listItem">
									
				</mu-list-item>
				
			</mu-list>

			<mu-list>
				<mu-list-item :title="accesstoken ? '退出' : '登录'" class="listItem" @click="onLogin()">
									
				</mu-list-item>
			</mu-list>

		</div>
	</div>
</template>

<script>
import appBar from '@/components/appBar'
import eventBus from '@/util/eventBus'
import store from 'vuex'

	export default{
		name: 'settings',
		data(){
			return {
				accesstoken: ''
			}
		},
		components:{
			appBar
		},
		methods:{
			onLogin(){
				
				if(this.accesstoken == "" || this.accesstoken == null){
					
					this.$router.push( {path: '/login'})
				}else{
					this.$store.commit("setAccesstoken",'');
    				this.$store.commit("setLoginname",'');
    				this.$router.push({ path: '/login'})
				}
			}
		},
		created(){

			let accesstoken = localStorage.getItem("accesstoken");
			this.accesstoken = accesstoken;
				
			
		},
		mounted(){
			
			let self = this;

			eventBus.$on('login', function(msg){
			  	self.accesstoken = msg.accesstoken;
			  	
			})
				
		}
	}
</script>

<style lang="scss">
	.settings{
		background: #f0f0f0;
		position: fixed;
		top: 0px;
		bottom: 40px;
		width: 100%;
		overflow: auto;
	}
	.settingsContent{
		position: fixed;
		width: 100%;
		top: 56px;
		bottom: 4rem;
		overflow: auto;
	}

	.listItem{
		background: #fff;
		border-top: 1px solid #f0f0f0;
		border-bottom: 1px solid #f0f0f0;

	}
</style>