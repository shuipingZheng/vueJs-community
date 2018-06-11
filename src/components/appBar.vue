<template>
	<div class="appBar">
		<mu-appbar :title="appBar" titleClass="appBarClass">
        </mu-appbar>
	</div>
</template>

<script>
	export default{
		name: 'appbar',
		data(){
			return {

			}
		},
		props: ['appBar']
	}
</script>

<style lang="scss">
	.appBarClass{
	    text-align: center;
	    padding: 0;
	}
</style>