<template>
    <div class="wrapper-page">
        <div class="left">
            <Navigation class="menu-top" />
        </div>
        <div class="center">
            <div class="card">
                <div class="card-header">
                    <div class="card-header-left">
                        <div class="card-header-left__avatar">
                            <img :src="post.userAvatar" alt="avatar" />
                        </div>
                        <div class="card-header-left__content">
                            <p class="name">{{ post.username }}</p>
                            <p class="time">{{ postTime }}</p>
                        </div>
                    </div>
                    <div
                        class="card-header-right"
                        v-if="userCanDelete"
                        @click="showDeleteBtn = !showDeleteBtn"
                    >
                        <div class="icon">
                            <i class="fas fa-ellipsis-h"></i>
                            <div
                                class="delete-btn"
                                v-if="showDeleteBtn"
                                @click.stop="deletePost(post._id)"
                            >
                                <i class="far fa-trash-alt"></i>
                                <span> Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="post.imageUrl" class="card-image">
                    <img :src="post.imageUrl" alt="" />
                </div>
                <div class="card-content">
                    <p>{{ post.content }}</p>
                </div>
                <div class="divider"></div>
                <div class="card-reaction">
                    <i
                        class="far fa-thumbs-up"
                        @click="likeOnePost(post._id)"
                        :class="isLiked ? 'liked' : ''"
                        ><span>Like</span
                        ><span v-if="likesLength"
                            >({{ post.likers.length }})</span
                        ></i
                    >
                    <i class="far fa-comment"
                        ><span>Comment</span
                        ><span v-if="commentsLength"
                            >({{ post.comments.length }})</span
                        ></i
                    >
                    <i class="far fa-share-square"><span>Share</span></i>
                </div>
                <div class="divider"></div>
                <div class="comments">
                    <!--Item commentaire -->
                    <div
                        class="comments-list"
                        v-for="comment in post.comments"
                        :key="comment._id"
                    >
                        <div class="comments-list__avatar">
                            <img :src="comment.userAvatar" alt="avatar" />
                        </div>
                        <div class="comments-list__content">
                            <p class="comment-name">{{ comment.username }}</p>
                            <p class="comment-description">
                                {{ comment.content }}
                            </p>
                        </div>
                        <div
                            class="comments-list__delete-btn"
                            v-if="USERID == comment.userId"
                        >
                            <i
                                class="fas fa-trash-alt"
                                @click="deleteComment(post._id, comment._id)"
                            ></i>
                        </div>
                    </div>
                    <!--End item commentaire -->
                    <div class="comment-input-wrapper">
                        <input
                            class="comment-input"
                            type="text"
                            v-model="comment"
                            placeholder="Write a comment.."
                            @keyup.enter="sendComment(post._id, comment._id)"
                        />
                        <div
                            class="comment-input-icon"
                            @click="sendComment(post._id, comment._id)"
                        >
                            <i class="fas fa-arrow-circle-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navigation from '../components/Navigation.vue';
export default {
    components: { Navigation },
    name: 'Post',
    props: ['id'],
    setup(props) {
        const post = ref([]);
        const showDeleteBtn = ref(false);
        const store = useStore();
        const router = useRouter();
        const comment = ref('');
        const USERID = JSON.parse(sessionStorage.getItem('user')).userId;
        const apiURL = 'https://social-network-join-us.herokuapp.com';

        const getOnepost = (id) => {
            if (sessionStorage.getItem('user')) {
                const token = JSON.parse(sessionStorage.getItem('user')).token;

                axios
                    .get(`${apiURL}/post/${id}`, {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        post.value = response.data;
                    })
                    .catch((error) => console.log(error));
            }
        };

        //CONVERTIR L'HEURE EN FORMAT ADAPTE
        const postTime = computed(() => {
            if (post.value) {
                const date = new Date(post.value.createdAt);
                const year = date.getFullYear();
                let month = date.getMonth() + 1;
                let dt = date.getDate();

                if (dt < 10) {
                    dt = '0' + dt;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                return dt + '/' + month + '/' + year;
            } else {
                return '';
            }
        });

        //VERIFIER SUR L'USER EST LE MEME QUE L'USER QUI A POSTER LE CONTENU POUR POUVOIR SUPPRIMER SON POST
        const userCanDelete = computed(() => {
            const userId = JSON.parse(sessionStorage.getItem('user')).userId;
            return post.value.userId == userId;
        });

        //ENVOYER UN COMMENTAIRE
        const sendComment = (id) => {
            if (comment.value) {
                const userId = JSON.parse(sessionStorage.getItem('user'))
                    .userId;
                const token = JSON.parse(sessionStorage.getItem('user')).token;

                const obj = {
                    userId: userId,
                    content: comment.value,
                };

                axios
                    .post(`${apiURL}/post/${id}/comment`, obj, {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        console.log(response.data);
                        comment.value = '';
                        getOnepost(props.id);
                    })
                    .catch((error) => console.log(error));
            } else {
                return;
            }
        };

        //LIKER UN POST
        const likeOnePost = (id) => {
            const userId = JSON.parse(sessionStorage.getItem('user')).userId;
            const token = JSON.parse(sessionStorage.getItem('user')).token;
            const obj = {
                userId: userId,
            };
            axios
                .post(`${apiURL}/post/${id}/like`, obj, {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    getOnepost(props.id);
                })
                .catch((error) => console.log(error));
        };

        const isLiked = computed(() => {
            const userId = JSON.parse(sessionStorage.getItem('user')).userId;
            if (post.value.likers !== undefined) {
                return post.value.likers.includes(userId);
            }
            return false;
        });

        const deletePost = (id) => {
            store
                .dispatch('deletePost', id)
                .then(() => {
                    router.push('/');
                })
                .catch((error) => console.log(error));
        };

        const deleteComment = (id, commentId) => {
            const token = JSON.parse(sessionStorage.getItem('user')).token;
            axios
                .delete(`${apiURL}/post/${id}/comment/${commentId}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log(response);
                    getOnepost(props.id);
                })
                .catch((error) => console.log(error));
        };

        const commentsLength = computed(() => {
            if (post.value.comments != undefined) {
                return post.value.comments.length > 0;
            } else {
                return false;
            }
        });

        const likesLength = computed(() => {
            if (post.value.likers != undefined) {
                return post.value.likers.length > 0;
            } else {
                return false;
            }
        });

        onMounted(() => {
            getOnepost(props.id);
        });
        return {
            comment,
            sendComment,
            post,
            getOnepost,
            postTime,
            likeOnePost,
            deleteComment,
            deletePost,
            isLiked,
            showDeleteBtn,
            userCanDelete,
            USERID,
            apiURL,
            commentsLength,likesLength
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
.card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
    margin-bottom: 20px;
    height: fit-content;
}
.card-header {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
}
.card-header-left {
    display: flex;
    align-items: center;
    &__avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &__content {
        margin-left: 10px;
        .name {
            font-weight: 500;
            text-transform: capitalize;
        }
        .time {
            font-size: 0.8rem;
            color: grey;
        }
    }
}
.card-header-right {
    display: flex;
    align-items: center;
    .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        .delete-btn {
            background: rgba($color: red, $alpha: 0.2);
            cursor: pointer;
            position: absolute;
            bottom: 0px;
            left: -110px;
            border-radius: 20px;
            font-size: 0.9rem;
            width: 100px;
        }
        &:hover {
            background: rgba($color: #000000, $alpha: 0.02);
        }
        i {
            line-height: 40px;
        }
    }
}
.card-image {
    width: 100%;
    img {
        width: 100%;
        height: 100%;
        max-height: 350px;
        object-fit: contain;
        display: block;
    }
}
.card-content {
    padding: 15px 20px;
    font-size: 0.95rem;
}
.divider {
    width: 100%;
    height: 1px;
    background: rgba($color: #000000, $alpha: 0.1);
}
.card-reaction {
    padding: 15px 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    i {
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        color: rgba($color: #000000, $alpha: 0.85);
        &.like-active {
            color: teal;
        }
        span {
            font-size: sans-serif;
            font-size: 0.9rem;
            display: inline-block;
            margin-left: 5px;
        }
        cursor: pointer;
        &:hover {
            transform: scale(1.05);
        }
    }
}
.comments {
    padding: 15px 20px;
}
.comments-list {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    &__avatar {
        width: 45px;
        height: 45px;
        img {
            display: block;
            object-fit: cover;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    &__content {
        width: calc(100% - 55px);
        margin-left: 10px;
        .comment-name {
            font-weight: 500;
            font-size: 0.95rem;
            text-transform: capitalize;
        }
        .comment-description {
            font-size: 0.9rem;
        }
    }
    &:hover .comments-list__delete-btn {
        opacity: 1;
    }
    &__delete-btn {
        cursor: pointer;
        opacity: 0;
        width: 15px;
        color: rgba($color: red, $alpha: 0.6);
        font-size: 0.9rem;
        align-self: center;
        transition: opacity 250ms ease;
    }
}
.comment-input-wrapper {
    display: flex;
    align-items: center;
    background: #f1f1f1;
    border-radius: 20px;
}
.comment-input {
    width: calc(100% - 50px);
    border: none;
    background: transparent;
    outline: none;
    padding: 10px 25px;
    font-size: 1rem;
}
.comment-input-icon {
    width: 50px;
    height: 50px;
    text-align: center;
    cursor: pointer;
    i {
        font-size: 1.4rem;
        line-height: 50px;
    }
}

i.liked {
    color: teal;
}
//MEDIA QUERIES
@media screen and (max-width: 1200px) {
    .left {
        width: 20%;
    }
    .center {
        width: 80%;
        margin-left: 20%;
    }
}

@media screen and (max-width: 767px) {
    .left {
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

@media screen and (max-width: 600px) {
    .card-reaction {
        justify-content: space-between;
    }
    .comment-input-icon {
        i {
            font-size: 1.2rem;
        }
    }
}
</style>
