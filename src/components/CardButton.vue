<template>
    <button v-bind="$attrs"
            :disabled="disabled"
            @click="handleClick()">

        <Card :class="cardClass" class="item">
            <slot/>
        </Card>

    </button>
</template>

<script>
    import Card from "./Card";
    export default {
        name: "CardButton",
        components: {Card},
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            cardClass: {
                type: String,
                default: ''
            },
        },
        methods: {
            handleClick() {
                this.$emit('click')
            }
        }
    }
</script>

<style scoped>
    button {
        @apply transition ease-in-out duration-200
    }

    button:active {
        @apply transform scale-95
    }

    .item {
        @apply transition ease-in-out duration-200 border
    }

    .item:hover {
        @apply bg-gray-200 border border-gray-400
    }
</style>
