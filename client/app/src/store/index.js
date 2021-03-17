import { createStore } from 'vuex';
import axios from 'axios';

const apiURL = 'https://social-network-join-us.herokuapp.com';

export default createStore({
    state: {
        isAuthenticated: false,
        allPosts: [],
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        allPosts: (state) => state.allPosts,
    },
    mutations: {
        CHECK_CONNECTION: (state) => {
            if (sessionStorage.getItem('user')) {
                state.isAuthenticated = true;
            } else {
                state.isAuthenticated = false;
            }
        },

        LOGOUT: (state) => {
            sessionStorage.clear();
            state.isAuthenticated = false;
        },

        SET_AUTHENTIFICATION: (state, payload) => {
            state.isAuthenticated = payload;
        },

        GET_ALL_POSTS: (state) => {
            if (sessionStorage.getItem('user')) {
                const token = JSON.parse(sessionStorage.getItem('user')).token;

                axios
                    .get(`${apiURL}/post`, {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        state.allPosts = response.data;
                    })
                    .catch((error) => console.log(error));
            } else {
                console.log('User is not connected!');
            }
        },
    },
    actions: {
        login: ({ commit }, data) => {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${apiURL}/auth/login`, data, {
                        headers: {
                            'Content-type': 'application/json',
                        },
                    })
                    .then((response) => {
                        sessionStorage.setItem(
                            'user',
                            JSON.stringify(response.data)
                        );
                        commit('SET_AUTHENTIFICATION', true);
                        resolve();
                    })
                    .catch((error) => {
                        alert(error.response.data['message']);
                        reject(error);
                    });
            });
        },
        deletePost: (context, id) => {
            const token = JSON.parse(sessionStorage.getItem('user')).token;
            return new Promise((resolve, reject) => {
                axios
                    .delete(`${apiURL}/post/${id}`, {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        resolve();
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        },
        deleteUser: ({ commit }, id) => {
            const token = JSON.parse(sessionStorage.getItem('user')).token;
            return new Promise((resolve, reject) => {
                axios
                    .delete(`${apiURL}/auth/delete-user/${id}`, {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        sessionStorage.clear();
                        commit('SET_AUTHENTIFICATION', false);
                        resolve();
                    })
                    .catch((error) => reject(error));
            });
        },

        updateProfile: (context, data) => {
            const token = JSON.parse(sessionStorage.getItem('user')).token;
            const userId = JSON.parse(sessionStorage.getItem('user')).userId;
            return new Promise((resolve, reject) => {
                axios
                    .put(`${apiURL}/auth/profile/${userId}`, data, {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },
        getAllPosts:({commit}) => {
            return commit('GET_ALL_POSTS')
        }
    },
    modules: {},
});
