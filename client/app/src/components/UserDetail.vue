<template>
    <div class="wrapper-profile">
        <h1 class="heading">
            Bienvenue sur votre profile {{ user.username }}!
        </h1>
        <div class="avatar">
            <div v-if="!updating" class="avatar-box">
                <img :src="user.userAvatar" alt="avatar" />
                <div class="overlay" @click="updating = true">
                    <button class="modify-btn">Modify</button>
                </div>
            </div>
            <div v-if="updating" class="avatar-modif">
                <form ref='form' @submit.prevent="updateProfile()">
                    <label for="file">Choisissez une nouvelle photo de profil:</label>
                    <input type="file" @change="handleFile($event)" ref='file' id='file' name="file" accept="image/*" required/>
                    <button type="submit" class="modify-btn">
                        Update avatar
                    </button>
                    <button
                        class="modify-btn modify-btn-cancel"
                        @click="updating = false"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
        <div class="form-group username">
            <p>Username:</p>
            <h2>{{ user.username }}</h2>
        </div>
        <div class="form-group email">
            <p>Email:</p>
            <h2>{{ user.email }}</h2>
        </div>
        <button class="delete-btn" @click="deleteUser(user._id)">
            Delete my account
        </button>
        <Loader v-if="loading"/>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Loader from './Loader'
export default {
    name: 'User Detail',
    components: {Loader},
    props: ['user'],
    setup(props, {emit}) {
        const store = useStore();
        const router = useRouter();
        const updating = ref(false);
        const file = ref(null)
        const form = ref(null)
        const loading = ref(false)

        const deleteUser = (id) => {
            if (
                window.confirm('Are you sure you want to delete your account ?')
            ) {
                store.dispatch('deleteUser', id)
                .then( () => router.push('/'))
                .catch(err => console.log(err))
            } else {
                return;
            }
        };
        const handleFile = (event) => {
            file.value = event.target.files[0]
            console.log(file.value)
        }

        const updateProfile = () => {
          if (file.value) {
            let data = new FormData;
            data.append('file', file.value)

            loading.value = true
            store.dispatch('updateProfile', data)
            .then( async() => {
                await emit('updateAvatar')
                loading.value = false
                updating.value = false
            })
            .catch(err => console.log(err))
          }
          else{
            return
          }
        };

        return { deleteUser, store, router, updateProfile, updating, file, handleFile, form , loading, Loader};
    },
};
</script>

<style lang="scss" scoped>
.wrapper-profile {
    text-align: center;
}
.heading {
    margin-top: 20px;
    font-size: 2.3rem;
}
.avatar {
    height: 300px;
    width: 300px;
    margin: 50px auto;
    position: relative;
    cursor: pointer;
    &:hover .overlay {
        opacity: 1;
    }
    img {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.avatar-box{
  width: 100%;
  height: 100%;
}
.avatar-modif {
    height: 100%;
    width: 100%;
    form {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        label{
            font-weight: 500;
        }
        input{
          width: 100%;
          padding: 10px 25px;
          margin: 10px 0;
          font-size: 1rem;
          border: none;
          border-radius: 20px;
          outline: none;
        }
    }
}
.form-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    h2,
    p {
        font-size: 1.3rem;
    }
    h2 {
        margin-left: 5px;
    }
}
.overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba($color: black, $alpha: 0.5);
    border-radius: 50%;
    opacity: 0;
}
.modify-btn {
    margin-top: 10px;
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    color: white;
    cursor: pointer;
    background-color: rgba($color: teal, $alpha: 0.85);
    font-size: 1rem;
    outline: none;
    &.modify-btn-cancel {
        background: rgba($color: black, $alpha: 0.6);
    }
}
.delete-btn {
    margin-top: 10px;
    padding: 15px 25px;
    border-radius: 20px;
    border: none;
    color: white;
    cursor: pointer;
    background-color: rgba($color: red, $alpha: 0.6);
    font-size: 1rem;
}

@media screen and (max-width: 600px) {
    .heading {
        font-size: 1.8rem;
        margin-top: 0;
    }
    .avatar {
        width: 80%;
        height: 300px;
        margin: 30px auto;
    }
}
</style>
