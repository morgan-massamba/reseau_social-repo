<template>
    <div class="home">
        <Login v-if="!isAuthenticated" />

        <div v-if="isAuthenticated" class="container">
            <div class="left">
              <Navigation/>
            </div>
            <div class="center">
                <Upload class="upload"/>
                <Posts v-for="post in allPosts" :key='post._id' :post='post' class="posts"/>
            </div>
            <div class="right">
              <Chat/>
            </div>
        </div>
    </div>
</template>

<script>
import {computed, onMounted} from 'vue'
import { useStore } from 'vuex';
import Login from '@/components/Login.vue';
import Navigation from '@/components/Navigation.vue';
import Upload from '@/components/Upload.vue';
import Posts from '@/components/Posts.vue';
import Chat from '@/components/Chat.vue';

export default {
    name: 'Home',
    components: {
        Login,
        Navigation,
        Upload, Posts, Chat
    },
    setup() {
        const store = useStore()
        const isAuthenticated = computed (()=> store.getters.isAuthenticated);
        const allPosts = computed (()=> store.getters.allPosts);

        onMounted( () => {
          store.commit('CHECK_CONNECTION')
          store.commit('GET_ALL_POSTS')
        })

        return { isAuthenticated, store, allPosts };

    },
};
</script>

<style lang="scss" scoped>
.home{
  background: #f1f1f1;
}
.container{
  min-height: 100vh;
  background-color:#f1f1f1;
  .left{
    width: 10%;
    border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
    height: 100vh;
    padding: 20px;
    position: fixed;
    left:0;
    top:0;
  }
  .center{
    width: 70%;
    margin-left: 10%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px;
  }
  .right{
    width: 20%;
    border-left: 1px solid rgba($color: #000000, $alpha: 0.1);
    position: fixed;
    right: 0;
    top:0;
    height: 100vh;
    padding: 20px;
  };
}
.upload{
  width: 100%;
}
.posts{
  width: 100%;
}
//MEDIA QUERIES
@media screen and (max-width:1200px) {
  .container .right{
    display: none;
  }
  .container .left{
    width: 20%;
  }
  .container .center{
    width: 80%;
    margin-left: 20%;
  }
  .posts{
    width: 100%;
  }
}
@media screen and (max-width:767px) {
  .container .right{
    display: none;
  }

  .container .left{
    display: block;
    width: 100%;
    position: initial;
    border-right: none;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    height: auto;
    
  }
  .container .center{
    width: 100%;
    margin-left: 0;
  }
}
</style>
