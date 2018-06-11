<template>
	<div class="add">
		<mu-appbar title="发布话题" titleClass="appBarClass">
	      <mu-icon-button icon="close" slot="left" @click="onClose()"/>
	      <mu-flat-button color="white" :label="preview ? '关闭预览' : '预览'" slot="right" @click="showPreview()" />
	    </mu-appbar>

	    <div class="release">
	    	<mu-text-field label="请填写标题" v-model="themeTitle" labelFloat fullWidth/><br>
	    	<mu-select-field v-model="modelName" :labelFocusClass="['label-foucs']" label="选择发布模块" fullWidth>
			    <mu-menu-item v-for="text,index in selectList" :key="index" :value="text" :title="text | switchName" />
			</mu-select-field>

			<mu-text-field label="正文" hintText="请参考Markdown语法" :value="input" @input="update" multiLine :rows="10" :rowsMax="10" fullWidth/>

			<div style="text-align:center">
				<mu-raised-button label="发布" class="demo-raised-button" primary @click="publish()"/>
			</div> 
	    </div>
		
		<div  v-show="preview" class="preview">
			<h2>{{themeTitle ? themeTitle : "标题"}}</h2>
			<p>来自 {{modelName | switchName}} - 发布于 {{new Date() | formatDate}}</p>
			<div v-html="compiledMarkdown"></div>
		</div>

		<mu-dialog :open="dialog" title="温馨提示：">
	      {{tipMsg}}
	      <mu-flat-button label="确定" slot="actions" primary @click="closeDialog()" />
	    </mu-dialog>
		
	</div>
</template>

<script>
	import store from 'vuex'
	import appBar from '@/components/appBar'
	import eventBus from '@/util/eventBus'
	/*marked编辑器需要导入*/
	import marked from 'marked'
	import lodash from 'lodash'

	export default{
		name: 'add',
		data(){
			return {
				preview: false,
				dialog: false,
				themeTitle: '',
				modelName: 'ask',
				selectList: ['ask','share', 'job'],
				input: '',
				tipMsg: '发布成功'
				
			}
		},
		components:{
			appBar
		},
		methods:{
			publish(){
				if(this.themeTitle==""){
					this.tipMsg = '标题不能为空'
					this.dialog = true;
					return false;
				}else if( this.input == ""){
					this.tipMsg = '正文不能为空'
					this.dialog = true;
					return false;
				}else if(this.themeTitle.length < 5){
					this.tipMsg = '标题文字太少'
					this.dialog = true;
					return false;
				}
				let self = this;
				this.$ajax.post('https://www.vue-js.com/api/v1/topics',{title: this.themeTitle, tab: this.modelName, content: this.input, accesstoken: this.accessToken})
						  .then(function(res){
						  	self.tipMsg = '发布成功'
						  	self.dialog = true;
						  	self.$router.go(-1);
						  	
						  	eventBus.$emit("publish",self.modelName)
						  	
						  	self.themeTitle = "";
						  	self.modelName = "ask";
						  	self.input = "";
						  })
						  .catch(function(error){
						  	
						  })
			},
			onClose(){
				this.$router.go(-1);
			},
			closeDialog(){
				this.dialog = false;
			},
			update: _.debounce(function (e) {
				//e.target.value
		      this.input = e 
		    }, 300),
		    showPreview(){
		    	this.preview = !this.preview;
		    }
		},
		computed: {
			loginname(){
				return this.$store.getters.getLoginname;
			},
			compiledMarkdown() {
		      	return marked(this.input, { sanitize: true })
		    },
		    accessToken(){
		    	return this.$store.getters.getAccesstoken;
		    }
		},
		created(){
			
		}
	}
</script>

<style lang="scss">
	.release{
		margin: .5rem;
	}
	.preview{
		width: 100%;
		position: fixed;
		top: 56px;
		background: #fff;
		bottom: 4.5rem;
		overflow: auto;
		z-index: 9999;
		padding: 1rem;
		word-wrap: break-word; 
		word-break: normal; 

		h2{
			margin: 0;
		}
	}
</style>