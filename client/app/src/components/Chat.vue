<template>
  <nav>
      <div class="search-box">
        <input type="text" placeholder="Search..">
        <i class="fas fa-search"></i>
      </div>
      <div class="friend-btns">
        <button class="btn-blue">FRIENDS</button>
        <button>ADD</button>
      </div>
      <ul>
        <li v-for="(human, index) in people" :key="index">
          <div class="avatar-wrapper">
            <img :src="human.src" alt="avatar">
            <span class="badge" :class="human.badge ? 'badge-active' : ''"></span>
          </div>
          <span class="name">{{human.name}}</span>
        </li>                   
      </ul>
  </nav>
</template>

<script>
import {ref} from 'vue'
export default {
  name:"Chat",
  setup(){
    const people = ref([
          { badge: true, name: 'Jason Oner', src: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { badge:false, name: 'Travis Howard', src: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { badge:false, name: 'Ali Connors', src: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { badge:true, name: 'Cindy Baker', src: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
          { badge: true, name: 'Aaron Fox', src: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { badge:true, name: 'Elisa Baker', src: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
          { badge:false, name: 'Elena Acras', src: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { badge:false, name: 'Julien Guerin', src: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
])
    return {people}
  }
}
</script>

<style lang='scss' scoped>
nav::-webkit-scrollbar{
  display: none;
}
nav{
  background: white;
  height: calc(100vh - 40px);
  border-radius: 20px;
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
  padding: 15px 20px;
  overflow-y: scroll;
}
.search-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  input{
    border: none;
    background: transparent;
    outline: none;
    width: 80%;
    height: 40px;
    font-size: 1rem;
  }
  i{
    width: 10%;
    cursor: pointer;
    color: rgba($color: #000000, $alpha: 0.45);
  }
}

.friend-btns{
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button{
    padding: 5px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    background: transparent;
    &.btn-blue{
      color: teal;
    }
  }
}

ul{
  display: flex;
  flex-direction: column;
  align-items: center;
  li {
    margin:15px 0;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 10px;
    .avatar-wrapper{
      height: 45px;
      width: 45px;
      margin-right: 20px;
      position:relative;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: block;
        object-fit: cover;
      }
      .badge{
        width: 12px;
        height: 12px;
        border: 2px solid white;
        background-color: grey;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        right: 0;
        &.badge-active{
          background-color: rgb(32, 204, 26);
        }
      }
    }
  }
}
</style>