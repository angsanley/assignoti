<template>
    <div>
        <h4>Your tasks</h4>
        {{ tasksList }}
    </div>
</template>

<script>
    export default {
        name: "UserTasksWidget",
        props: ['tasksList']
    }
</script>

<style scoped>

</style>
