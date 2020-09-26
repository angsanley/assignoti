<template>
    <div class="container">
        <h1>Hello, {{ user.displayName }}!</h1>
        <user-tasks-widget/>
    </div>
</template>

<script>
    import UserTasksWidget from "../../components/Dashboard/UserTasksWidget";
    export default {
        name: "DashboardHome",
        components: {UserTasksWidget},
        data() {
            return {
            }
        },
        mounted() {
            this.$store.dispatch('getAuthenticatedUser')
        },
        computed: {
            user() {
                return this.$store.state.user
            },
        }
    }
</script>

<style scoped>

</style>
