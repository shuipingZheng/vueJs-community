<template>
  <div id="app">

    <keep-alive>
      <router-view/>
    </keep-alive>


    <navigation></navigation>
  </div>
</template>

<script>
import navigation from '@/components/navigation'
import store from 'vuex'
export default {
  name: 'App',
  data(){
    return {
      
    }
  },
  created(){
    let accesstoken = localStorage.getItem("accesstoken");
    let loginname = localStorage.getItem("loginname");
    this.$store.commit("setAccesstoken",accesstoken);
    this.$store.commit("setLoginname",loginname);
  },
  components:{
    navigation
  }
}
</script>

<style>
html{
  font-size: 10px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
/*  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}

</style>
