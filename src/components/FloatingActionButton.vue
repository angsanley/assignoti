<template>
    <button
            class="button"
            v-bind="$attrs"
            :class="{
                primary : this.primary,
                dark : this.dark
            }"
            @click="handleClick()">
        <div class="button-content">
            <img v-if="iconSrc" :class="iconClass" :src="iconSrc" class="icon">
            <div class="w-full flex justify-center"><slot/></div>
        </div>
    </button>
</template>

<script>
    export default {
        name: "FloatingActionButton",
        props: {
            primary: {
                type: Boolean,
                default: false
            },
            dark: {
                type: Boolean,
                default: false
            },
            iconSrc: {
                type: String,
                default: null
            },
            iconClass: {
                type: String,
                default: null
            }
        },
        methods: {
            handleClick() {
                this.$emit('click')
            }
        }
    }
</script>

<style scoped>
    .button {
        @apply py-2 h-16 w-16 fixed bottom-0 right-0 mb-8 mr-8 px-4 bg-white shadow-lg rounded-full font-display font-bold transition ease-in-out duration-200 border-solid border border-gray-300;
    }

    .primary {
        @apply bg-primary text-white border-primary-700;
    }

    .button:active {
        @apply transform scale-95 shadow-none;
    }

    .button:hover {
        @apply bg-gray-200;
    }

    .primary:hover {
        @apply bg-primary-500;
    }

    .icon {
        @apply h-6 w-6 mr-4;
    }

    .button-content {
        @apply flex h-full items-center;
    }

    .dark {
        @apply w-full bg-gray-700 text-white;
    }

    .dark:hover {
        @apply bg-gray-600;
    }
</style>
