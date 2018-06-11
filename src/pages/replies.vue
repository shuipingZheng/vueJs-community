<template>
	<div class="comment">
		<!-- <mu-list>
			<mu-sub-header class="subHeader" >添加回复</mu-sub-header>
			<mu-list class="mu-comment">
				<mu-text-field labelClass="ee"	hintTextClass="hintText" hintText="不允许超过100个字符" :errorText="multiLineInputErrorText" @textOverflow="handleMultiLineOverflow" multiLine fullWidth  :rows="3" :rowsMax="6" :maxLength="100"/>
				<mu-raised-button label="提交" class="demo-raised-button submit" primary/>
			</mu-list>
		</mu-list> -->
		<div class="repliesHeader">
			<mu-appbar title="评论" titleClass="backBarClass">
		      <mu-icon-button icon="close" slot="left" @click="onClose()"/>
		      <mu-flat-button color="white" label="取消回复" slot="right" v-if="repliesTxt!='添加评论'" @click="cancelR()"/>
		    </mu-appbar>	
		</div>
		
		<div class="repliesBody">
			<mu-list >
				<mu-sub-header class="subHeader" v-if="replies">{{replies.length}} 评论</mu-sub-header>
				<mu-list>
					<mu-list-item v-for="item, index in replies" :key="index" :value="index"  :title="item.author.loginname" :afterText="item.create_at| formatDate"  @click="openBottomSheet(item)">
		             	<mu-avatar :src="item.author.avatar_url" slot="leftAvatar" :size="30"/>
			            <span v-html="item.content"></span>
			            <span slot="describe">{{index +1}} 楼</span>

		            <mu-divider/>
		            </mu-list-item>
				</mu-list>
	            
	        </mu-list>
		</div>

		<div class="repliesFooter">
			 <mu-text-field :hintText="repliesTxt" class="repliesText" ref="repliesText" v-model="repliesValue"/>
			 <mu-icon-button icon="send" class="repliesBtn" @click="sendReply()"/>
		</div>

		<mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
		    <mu-list @itemClick="closeBottomSheet">
		      <mu-list-item title="回复评论" @click="comments()"/>
		      <mu-list-item title="踩评论"/>
		      <mu-list-item title="举报"/>
		    </mu-list>
		</mu-bottom-sheet>

		<mu-popup position="top" :overlay="false" popupClass="demo-popup-top" :open="topPopup">
		    
		    <div v-if="reply_id!=''">回复成功</div>
		    <div v-else>评论成功</div>

		</mu-popup>

	</div>
</template>

<script>
import store from 'vuex'
import eventBus from '@/util/eventBus'

	export default{
		name: 'replies',
		data(){
			return{
				topPopup: false,
				multiLineInputErrorText: '',
				bottomSheet: false,
				repliesValue: '',
				repliesTxt: '添加评论',
				reply_id: '', //如果这个评论是对另一个评论的回复，请务必带上此字段
				reply_name: ''
			}
		},
		props: ['replies'],
		methods:{
			closeBottomSheet () {
		      	this.bottomSheet = false
		    },
		    openBottomSheet (item) {
		      	this.bottomSheet = true;
		      	this.reply_id = item.id;
		      	this.reply_name = item.author.loginname;
		    },
		    handleMultiLineOverflow (isOverflow) {
		      	this.multiLineInputErrorText = isOverflow ? '超过啦！！！！' : ''
		    },
		    comments(){
		    	this.repliesTxt = '回复 '+ this.reply_name + ' 的评论';
		    	this.$refs.repliesText.focus();
		    },
		    onClose(){
		    	this.$store.commit("setShowReplies");
		    },
		    cancelR(){
		    	this.repliesTxt = '添加评论';
		    	this.reply_id = '';
		      	this.reply_name = '';
		    },
		    sendReply(){

		    	let aid = this.$route.query.aid;
		    	let url = 'https://www.vue-js.com/api/v1/topic/'+ aid +'/replies';

		    	let self = this;
		    	let  repliesValue;
		    	if(this.reply_id !=""){  //回复评论
		    		repliesValue = '<a href="/user/'+this.reply_name+'">@'+this.reply_name+'</a>' + this.repliesValue;
		    	}else{  //添加评论
		    		repliesValue = this.repliesValue;
		    	}

		    	this.$ajax.post( url ,{
		    		accesstoken : self.accesstoken,
		    		content : repliesValue,
		    		reply_id : self.reply_id
		    	})
    			  .then(function(res){
    			  	eventBus.$emit("replies",res.data.success);
    			  	self.topPopup = true;
    			  	self.repliesValue = "";
    			  	self.cancelR();

    			  })
    			  .catch(function(error){

    			  })
		    }
		},
		computed:{
			accesstoken(){
				return this.$store.getters.getAccesstoken;
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
		  }
	}
</script>

<style lang="scss">
.comment{
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background: #fff;
}
.repliesHeader{
	position: fixed;
	top: 0;
	width: 100%;

}
.repliesBody{
	position: fixed;
	top: 56px;
	bottom: 48px;
	width: 100%;
	overflow: auto;
}
.repliesFooter{
	position: fixed;
	width: 100%;
	height: 48px;
	bottom: 0px;
	display: flex;
	border-top: 1px solid #f0f0f0;

	.repliesText{
		flex: 1;
		margin-left: 10px;
	}

}
.mu-comment{
	padding: 0 1.6rem;

	.mu-text-field-multiline{
		border: 1px solid #ccc;
	}

	.submit{
		float: right;
		padding: .25rem .3rem
	}
	
}
.hintText{
	font-size: 1.4rem;
}
.demo-popup-top {
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

