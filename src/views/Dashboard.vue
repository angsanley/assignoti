<template>
    <div id="app" class="parent">
        <div class="bg-primary sidebar" :class="{sidebarHidden: hidden}">
            <the-sidebar v-on-clickaway="hideSidebar"/>
        </div>

        <transition name="fade">
            <!-- Sidebar background -->
            <div v-if="!hidden" class="sidebar-bg"/>
        </transition>

        <div class="content">
            <the-navbar/>
            <div class="h-full pt-6 pb-24 lg:pb-0 overflow-y-scroll"><router-view/></div>
        </div>
    </div>
</template>

<script>
    import TheSidebar from "../components/TheSidebar";
    import { mixin as clickaway } from 'vue-clickaway'
    import TheNavbar from "../components/TheNavbar";
    export default {
        name: "Dashboard",
        components: {TheNavbar, TheSidebar},
        mixins: [ clickaway ],
        computed: {
            hidden() {
                return this.$store.state.sidebarHidden
            }
        },
        methods: {
            showSidebar() {
                setTimeout( () => {
                    this.$store.dispatch('showSidebar')
                }, 10)
            },
            hideSidebar() {
                this.$store.dispatch('hideSidebar')
            }
        },
        watch: {
            '$route' () {
                this.hideSidebar()
            }
        }
    }
</script>

<style scoped>
    .content {
        @apply h-screen overflow-hidden
    }
    .sidebar {
        @apply h-screen w-64 fixed transition ease-out duration-300 left-0 top-0 z-30;
    }

    .sidebarHidden {
        @apply transform -translate-x-64;
    }

    .sidebar-bg {
        @apply fixed h-screen w-screen top-0 left-0 z-20 bg-black opacity-25
    }

    .fade-enter-active, .fade-leave-active {
        @apply transition-opacity duration-200 ease-in-out
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        @apply opacity-0
    }

    @screen lg {
        .parent {
            @apply grid;
            grid-template-columns: minmax(150px, 16rem) 1fr;
        }

        .sidebar {
            @apply h-screen ml-0 static;
        }

        .sidebarHidden {
            @apply left-0 translate-x-0
        }

        .sidebar-bg {
            @apply hidden
        }
    }
</style>
