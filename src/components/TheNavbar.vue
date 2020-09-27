<template>
    <div class="navbar">
        <div class="inner space-x-2">
            <div class="mobile-items space-x-2">
                <button @click="openSidebar()" class="toggle-sidebar"><MenuIcon/></button>
            </div>
            <div>
                <h4>Assignoti</h4>
            </div>
            <div>
                <button><img class="user-profile" :src="userObj.photoURL"/></button>
            </div>
        </div>
    </div>
</template>

<script>
    import { MenuIcon } from "vue-feather-icons"
    export default {
        name: "TheNavbar",
        components: { MenuIcon },
        methods: {
            openSidebar() {
                setTimeout( () => {
                    this.$store.dispatch('showSidebar')
                }, 10)
            }
        },
        computed: {
            userObj() {
                return this.$store.state.user
            }
        }
    }
</script>

<style scoped>
    .navbar {
        @apply shadow-lg w-full h-16 flex flex-col justify-center bg-white mb-6
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

    @screen lg {
        .mobile-items {
            @apply hidden
        }
    }
</style>
