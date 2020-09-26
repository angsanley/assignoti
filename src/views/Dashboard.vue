<template>
    <div id="app" class="parent">
        <div class="bg-primary sidebar">
            <the-sidebar/>
        </div>
        <div class="content">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import TheSidebar from "../components/TheSidebar";
    export default {
        name: "Dashboard",
        components: {TheSidebar}
    }
</script>

<style scoped>
    .parent {
        @apply grid;
        grid-template-columns: minmax(150px, 16rem) 1fr;
    }

    .sidebar {
        @apply h-screen;
    }
</style>
