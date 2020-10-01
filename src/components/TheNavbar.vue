<template>
    <div class="navbar" v-click-outside="closeUserCard">
        <div class="inner space-x-2">
            <div class="mobile-items space-x-2">
                <button @click="openSidebar()" class="toggle-sidebar"><MenuIcon/></button>
            </div>
            <div>
                <h4>Assignoti</h4>
            </div>
            <button v-if="this.userObj" @click.prevent="toggleUserCard"><img class="user-profile" :src="userObj.photoURL" alt="profile"/></button>
            <!-- <a href="#" @click="toggleUserCard()" ><img class="account-pic h-10 w-10" :src="userObj.photoURL" alt="profile picture"/></a> -->
        </div>

        <transition name="fade">
            <div class="user-card" v-if="showUserCard">
                <div class="flex flex-col items-center">
                    <img class="account-pic h-24 w-24" :src="userObj.photoURL" alt="profile picture"/>
                    <div class="text-sm mt-2 dark-mode:text-gray-400">{{userObj.displayName }}</div>
                    <a href="#" @click.prevent="logout" class="border-2 rounded-full w-full py-1 mt-4 text-center text-gray-700 dark-mode:text-gray-400 no-underline hover:bg-gray-100 dark-mode:hover:bg-gray-800 focus:outline-none">Logout</a>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { MenuIcon } from "vue-feather-icons"
    export default {
        name: "TheNavbar",
        data() {
            return {
                showUserCard: false,
                
            }
        },
        components: { MenuIcon },
        methods: {
            openSidebar() {
                setTimeout( () => {
                    this.$store.dispatch('showSidebar')
                }, 10)
            },
            toggleUserCard() {
                this.showUserCard = !this.showUserCard
            },
            closeUserCard() {
                this.showUserCard = false;
            },
            logout() {
                this.$store.dispatch('clearAll');
                this.$router.push('/login');
            },
            // async getPhoto() {
            //     const GeneralRepository = RepositoryFactory.get('general');
            //     const response = await GeneralRepository.getPhoto();
            //     this.profilePicture = `data:image/png;base64,${response.data['photo']}`;
            // }
        },
        computed: {
            userObj() {
                return this.$store.state.user
            }
        },
        mounted() {
            this.$store.dispatch('getAuthenticatedUser')
        },
    }
</script>

<style scoped>
    .navbar {
        @apply shadow-lg w-full h-16 flex flex-col justify-center bg-white
    }

    .inner {
        @apply px-4 flex items-center justify-between
    }

    .toggle-sidebar {
        @apply p-2 transition ease-out duration-300
    }

    .toggle-sidebar:hover {
        @apply transform shadow-lg bg-gray-200 rounded-lg
    }

    .toggle-sidebar:active {
        @apply transform scale-95
    }

    .mobile-items {
        @apply flex items-center
    }

    .user-profile {
        @apply w-10 h-10 rounded-full
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .user-card {
        @apply bg-white rounded-lg shadow-xl fixed px-4 py-6 mt-16 mr-6 top-0 right-0;
    }

    @screen lg {
        .mobile-items {
            @apply hidden
        }
    }
</style>
