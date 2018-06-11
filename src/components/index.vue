<template>
	<div class="index">
		<themeTabs></themeTabs>
	</div>
</template>

<script>

import themeTabs from '@/components/themeTabs'
	export default{
		name: '',
		data(){
			return {

			}
		},
		components: {
			
			themeTabs: themeTabs
		}
	}
</script>


<style lang="scss">
	.index{
		position: fixed;
		top: 0px;
		bottom: 40px;
		width: 100%;
		overflow: auto;
	}

</style>