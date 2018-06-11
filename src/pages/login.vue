<template>
	<div class="login">
		 <app-bar appBar="登录"></app-bar>
		 <mu-text-field label="accessToken" v-model="accesstoken" hintText="请输入accessToken" type="text" labelFloat /><br>
		 <mu-raised-button class="demo-raised-button" label="登录"  primary @click="login()"/><br><br>

		 <mu-raised-button class="demo-raised-button" label="如何获取accesstoken" icon="info" @click="showSnackbar()"/>

		 <mu-popup position="top" :overlay="false" popupClass="popup-top" :open="topPopup">
		    {{tipText}}
		 </mu-popup>

		 <mu-snackbar v-if="snackbar" message="vueJs社区注册登录后，在设置页面可以看到自己的 accessToken" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
	</div>
</template>

<script>
import appBar from '@/components/appBar'
import eventBus from '@/util/eventBus'
import store from 'vuex'
	export default{
		name: 'login',
		data(){
			return {
				snackbar: false,
				accesstoken: '',
				topPopup: false,
				tipText: ''
			}
		},
		components:{
			appBar
		},
		methods:{
			showSnackbar () {
		      this.snackbar = true
		      if (this.snackTimer) clearTimeout(this.snackTimer)
		      this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000)
		    },
		    hideSnackbar () {
		      this.snackbar = false
		      if (this.snackTimer) clearTimeout(this.snackTimer)
		    },
			login(){
				if(this.accesstoken == "") {
					this.topPopup = true;
					this.tipText = '请输入accessToken';
					return false
				}
				let self = this;
				this.$ajax.post('https://www.vue-js.com/api/v1/accesstoken?accesstoken='+this.accesstoken)
						  .then(function(res){
						  
						  	if(res.data.success){
						  		localStorage.setItem('accesstoken',self.accesstoken)
						  		localStorage.setItem('loginname', res.data.loginname)
						  		self.$store.commit('setAccesstoken',self.accesstoken)
						  		self.$store.commit('setLoginname', res.data.loginname)
						  		self.$router.go(-1)

						  		eventBus.$emit("login",{accesstoken: self.accesstoken, loginname: res.data.loginname})
						  	}
						  })
						  .catch(function(error){
						  	self.topPopup = true;
							self.tipText = 'accessToken错误'
						  })
			}
		},
		watch: {
		    topPopup (val) {
		      if (val) {
		        setTimeout(() => {
		          this.topPopup = false
		        }, 2000)
		      }
		    }
		 },
		 created(){
		 	
		 }

	}
</script>

<style lang="scss">
	.login{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		background: #ffffff;
		z-index: 9999;
	}
	.popup-top {
	  width: 100%;
	  opacity: .8;
	  height: 3.8rem;
	  line-height: 3.8rem;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  max-width: 37.5rem;
	  background: #323232;
	  color: #ffffff;
	}
</style>