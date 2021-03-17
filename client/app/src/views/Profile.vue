<template>
    <div class="wrapper-page">
        <div class="left">
            <Navigation class="menu-top" />
        </div>
        <div class="center">
            <UserDetail :user='userInfos' @updateAvatar='updateAvatar'/>
        </div>
    </div>
</template>

<script>
import {ref, onMounted } from 'vue';
import axios from 'axios';
import Navigation from '../components/Navigation.vue';
import UserDetail from '../components/UserDetail.vue';
export default {
    components: { Navigation, UserDetail },
    name: 'Profile',
    props: ['id'],
    setup(props) {
        const userInfos = ref([]);
        const apiURL = "https://social-network-join-us.herokuapp.com"

        const getUser = (id) => {
            if (sessionStorage.getItem('user')) {
                const token = JSON.parse(sessionStorage.getItem('user')).token;

                axios
                    .get(`${apiURL}/auth/profile/${id}`, {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        userInfos.value = response.data.user;
                    })
                    .catch((error) => console.log(error));
            }
        };

        //METTRE A JOUR LE PROFIL QUAND ON RECOIT LA MODIFICATION DU COMPONENT USER DETAIL 
        const updateAvatar = () => {
            return getUser(props.id)
        }

        onMounted(() => {
            getUser(props.id);
        });
        return {
            userInfos,
            getUser, apiURL, updateAvatar
        };
    },
};
</script>

<style lang="scss" scoped>
.wrapper-page {
    background: #f1f1f1;
    min-height: 100vh;
}
.left {
    width: 10%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    padding: 20px;
    border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
}
.center {
    width: 90%;
    margin-left: 10%;
    padding: 20px;
}

a {
    color: #000000;
}

//MEDIA QUERIES
@media screen and (max-width:1200px) {
  .left{
    width: 20%;
  }
  .center{
    width: 80%;
    margin-left: 20%;
  }
}

@media screen and (max-width: 767px) {
    .left{
    display: block;
    width: 100%;
    position: initial;
    border-right: none;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    height: auto;
    
  }
    .center {
        width: 100%;
        margin-left: 0;
    }
}
</style>
