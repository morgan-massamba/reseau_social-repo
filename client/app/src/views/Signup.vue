<template>
    <section class="Signup">
        <div class="container">
            <div class="logo">
                <i class="fas fa-bolt"></i>
            </div>

            <h1 class="heading">Join Social</h1>

            <p class="description">
                You can easily signup, create and share your content with
                <span>100M</span>
                users.
            </p>

            <form @submit.prevent="signup()">
                <div class="form-group">
                    <i class="far fa-envelope"></i>
                    <input type="email" 
                    placeholder="Email" 
                    v-model="email"
                    required />
                </div>

                <div class="form-group">
                    <i class="far fa-user"></i>
                    <input
                        type="text"
                        placeholder="Username"
                        v-model="username"
                        required
                    />
                </div>

                <div class="form-group">
                    <i class="fas fa-lock"></i>
                    <input
                        type="password"
                        placeholder="Password"
                        v-model="password"
                        required
                    />
                </div>

                <button type="submit" class="btn">Continue</button>
            </form>

            <div class="divider">
                <span></span>
                <div>Or</div>
                <span></span>
            </div>

            <router-link to="/" class="btn btn-black">Login</router-link>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'
export default {
    name: 'Signup',
    setup() {
        const email = ref('');
        const username = ref('');
        const password = ref('');
        const router = useRouter();
        const apiURL = "https://social-network-join-us.herokuapp.com"

        const signup = () => {
            if (email.value && password.value && username.value) {
                const signupData = {
                    email: email.value,
                    password: password.value,
                    username: username.value,
                };

                axios
                    .post(`${apiURL}/auth/signup`, signupData, {
                        headers: {
                            'Content-type': 'application/json',
                        },
                    })
                    .then((response) => {
                        console.log(response.data);
                        router.push('/');
                    })
                    .catch((error) => console.log(error));

                email.value = '';
                username.value = '';
                password.value = '';

            } else {
                alert('veuillez remplir les champs');
            }
        };

        return { signup, email, username, password, router, apiURL };
    },
};
</script>

<style lang="scss" scoped>
section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: #f1f1f1;
}
.container {
    width: 375px;
    margin: 0 auto;
    text-align: center;
    padding: 40px;
}
.logo {
    width: 80px;
    height: 80px;
    background: teal;
    border-radius: 50%;
    text-align: center;
    margin: 0 auto 20px;
    i {
        color: white;
        line-height: 80px;
        font-size: 2.5rem;
    }
}
.heading {
    margin-bottom: 20px;
    font-size: 2rem;
}
.description {
    margin-bottom: 20px;
    span {
        font-weight: 500;
    }
}
form {
    padding: 20px 0;
    .form-group {
        margin-bottom: 10px;
        border: 1px solid gray;
        border-radius: 30px;
        padding: 8px 15px;
        display: flex;
        align-items: center;
        i {
            width: 10%;
            text-align: center;
            height: 40px;
            line-height: 40px;
        }
        input {
            width: 90%;
            height: 40px;
            padding: 0 10px;
            border: none;
            background: transparent;
            outline: none;
            font-size: 1rem;
        }
    }

    p {
        margin: 20px 0;
        font-size: 0.9rem;
        letter-spacing: -0.5px;
    }
}
.btn {
    padding: 18px;
    cursor: pointer;
    background: white;
    border: 1px solid black;
    border-radius: 30px;
    outline: none;
    display: inline-block;
    width: 100%;
    transition: all 0.3s ease;
    &:hover {
        transform: scale(1.01);
    }
    &.btn-black {
        color: white;
        background: rgba($color: #000000, $alpha: 0.85);
    }
}
.divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    span {
        height: 1px;
        width: 120px;
        background: rgba($color: #000000, $alpha: 0.25);
    }
    div {
        margin: 0 5px;
        font-size: 0.9rem;
    }
}
</style>
