<template>
  <div class="headerBack">
    <mu-appbar :title="titleName" titleClass="backBarClass">
      <mu-icon-button icon="arrow_back_ios" slot="left" @click="onClose()"/>
    </mu-appbar>
  </div>
</template>

<script>
export default {
  name: 'headerBack',
  props:{
    titleName: String
  },
  methods:{
    onClose (){
      this.$router.go(-1);
    }
  }
}
</script>


<style lang="scss">
  .backBarClass{
      text-align: left;
      padding: 0;
  }
</style>
