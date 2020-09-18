<template>
    <div class="card">
        <slot/>
    </div>
</template>

<script>
    export default {
        name: "Card"
    }
</script>

<style scoped>
    .card {
        @apply bg-white p-4 shadow-lg rounded-lg;
    }
</style>
