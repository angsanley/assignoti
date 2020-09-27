<template>
    <div id="app" class="parent">
        <div class="bg-primary sidebar" :class="{sidebarHidden: hidden}" v-on-clickaway="hideSidebar">
            <the-sidebar/>
        </div>
        <div class="content">
            <the-navbar/>
            <router-view/>
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
        }
    }
</script>

<style scoped>
    .sidebar {
        @apply h-screen w-64 fixed transition ease-out duration-300 left-0 top-0 z-30;
    }

    .sidebarHidden {
        @apply transform -translate-x-64;
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
    }
</style>
