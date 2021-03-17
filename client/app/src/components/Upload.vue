<template>
    <div class="wrapper">
        <span class="choice">Make a post</span>
        <form ref="form" @submit.prevent="newPost()">
            <div class="input-wrapper">
                <textarea
                    v-model="content"
                    placeholder="What's on your mind?"
                    rows="3"
                    required
                ></textarea>
            </div>
            <transition name="fade" tag="div" class="input-wrapper">
                <input
                    v-if="content"
                    type="file"
                    name="file"
                    ref="file"
                    accept="image/*"
                    required
                />
            </transition>
            <button class="submit-btn" type="submit">
                Send <i class="fas fa-arrow-circle-right"></i>
            </button>
        </form>
        <Loader v-if="loading"/>
    </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Loader from './Loader';
export default {
    name: 'Upload',
    component: 'Loader',
    setup() {
        const content = ref('');
        const store = useStore();
        const router = useRouter();
        const file = ref(null);
        const form = ref(null);
        const loading = ref(false);
        const apiURL = 'https://social-network-join-us.herokuapp.com';

        const newPost = () => {
            const userId = JSON.parse(sessionStorage.getItem('user')).userId;
            const token = JSON.parse(sessionStorage.getItem('user')).token;

            if (content.value && file.value) {
                const formData = new FormData();
                formData.append('userId', userId);
                formData.append('content', content.value);
                formData.append('file', file.value.files[0]);

                loading.value = true;

                axios
                    .post(`${apiURL}/post`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then(async(response) => {
                        console.log(response);
                        await store.dispatch('getAllPosts');
                        form.value.reset();
                        loading.value = false;
                    })
                    .catch((error) => {
                        console.log(error)
                        loading.value = false
                    });
            }
        };
        return {
            newPost,
            content,
            store,
            router,
            apiURL,
            file,
            form,
            Loader,
            loading,
        };
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: white;
    box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
    border-radius: 20px;
    margin-bottom: 20px;
    padding: 15px 20px;
}
.choice {
    margin-bottom: 15px;
    margin-left: 10px;
    display: inline-block;
}
form {
    display: flex;
    flex-wrap: wrap;
}
.input-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 20px;
    padding: 10px 25px;
    margin-bottom: 10px;

    textarea,
    input {
        width: 100%;
        border: none;
        outline: none;
        background-color: transparent;
        font-size: 1rem;
        resize: none;

        &::placeholder {
            font-size: 1rem;
        }
    }
}
.submit-btn {
    padding: 12px 20px;
    border: none;
    background-color: rgba($color: #000000, $alpha: 0.8);
    border-radius: 20px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    color: white;
    outline: none;
    cursor: pointer;
    margin-top: 5px;
    i {
        margin-left: 10px;
        font-size: 1.1rem;
    }
}
.fade-enter-active {
    animation: fading 0.3s ease;
}
.fade-leave-active {
    animation: fading 0.3s ease reverse;
}

@keyframes fading {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@media screen and (max-width: 767px) {
    .submit-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
