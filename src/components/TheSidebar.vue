<template>
    <div class="text-white">
        <div class="text-center my-4">
            <h1>Assignoti</h1>
        </div>
        <div class="nav-items">
            <router-link to="/dashboard" class="item" active-class="active" exact><HomeIcon/><span>Home</span></router-link>
            <router-link to="/dashboard/subscriptions" class="item" active-class="active"><BellIcon/><span>Subscriptions</span></router-link>
            <router-link to="/dashboard/channels" class="item" active-class="active"><SearchIcon/><span>Explore Channels</span></router-link>
            <router-link to="/dashboard/integrations" class="item" active-class="active"><LayersIcon/><span>Integrations</span></router-link>
        </div>
    </div>
</template>

<script>
    import { HomeIcon, BellIcon, SearchIcon, LayersIcon } from "vue-feather-icons"
    export default {
        name: "TheSidebar",
        components: {HomeIcon, BellIcon, SearchIcon, LayersIcon}
    }
</script>

<style scoped>
    .nav-items {
        @apply flex flex-col text-lg
    }

    .item {
        @apply flex text-white no-underline h-16 items-center px-4
    }

    .item > span {
        @apply ml-4
    }

    .item:hover {
        @apply bg-primary-500
    }

    .active {
        @apply font-bold bg-primary-700
    }
</style>
