<template>
  <nav>
      <ul>
        <li><router-link to="/"><i class="fas fa-home" :class="route.name === 'Home' ? 'active-nav' :''"></i></router-link></li>
        <li><router-link :to="'/profile/'+USERID" :class="route.name === 'Profile' ? 'active-nav' :''"><i class="fas fa-user"></i></router-link></li>    
        <li @click="logout()"><router-link to="/"><i class="fas fa-sign-out-alt"></i></router-link></li>  
      </ul>
  </nav>
</template>

<script>
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
export default {
  name:"Navigation",
  setup(){
    const store = useStore()
    const route = useRoute()
    const USERID = JSON.parse(sessionStorage.getItem('user')).userId
    const logout = () => {
      store.commit('LOGOUT')
    }
  return { logout, store, route, USERID}
  }
}
</script>

<style lang='scss' scoped>
nav{
  background: white;
  border-radius: 20px;
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
  height: 100%;
  overflow-y: scroll;
}
nav::-webkit-scrollbar{
  display: none;
}
ul{
  display: flex;
  flex-direction: column;
  align-items: center;
  li {
    margin:60px 0;
    cursor: pointer;
    a{
      font-size: 1.7rem;
      color: rgba($color: #000000, $alpha: 0.45);
    }
    &:hover a{
      color:teal;
    }
  }
}
.active-nav{
      color: teal;
}
@media screen and (max-width:767px) {
  ul{
    flex-direction: row;
    justify-content: space-around;
    li{
      margin: 20px 0;
    }
  }
}
</style>