<template>
	<div id="navigation">
		<mu-paper class="bottom">
		  <mu-bottom-nav :value="bottomNav" @change="handleChange">
		    <mu-bottom-nav-item v-for="nav in navList" :key="nav.value" :value="nav.value" :title="nav.name" :icon="nav.icon" :to="'/'+nav.value"/>
		   
		  </mu-bottom-nav>
		</mu-paper>
	</div>
</template>

<script>
	export default{
		name: 'navigation',
		data(){
			return {
				bottomNav: 'index',
				navList: [{
					name: '首页',
					value: 'index',
					icon: 'home'
				},{
					name: '消息',
					value: 'message',
					icon: 'email'
				},{
					name: '我的',
					value: 'person',
					icon: 'person'
				},{
					name: '设置',
					value: 'settings',
					icon: 'settings'
				}]
			}
		},
	  	methods: {
	    	handleChange (val) {
	     	 this.bottomNav = val
	    	}
	  	}
	}

</script>

<style lang="scss">
	
.bottom{
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>