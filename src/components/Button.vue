<template>
    <button
            class="button"
            v-bind="$attrs"
            :class="{
                primary : this.primary,
                dark : this.dark,
                clickable : !this.disabled,
                disabled : this.disabled,
                pressed : this.pressed,
            }"
            :disabled="disabled"
            @click="handleClick()">
        <div class="button-content">
            <img v-if="iconSrc" :class="iconClass" :src="iconSrc" class="icon">
            <slot/>
        </div>
    </button>
</template>

<script>
    export default {
        name: "Button",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            pressed: {
                type: Boolean,
                default: false
            },
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
        @apply py-2 px-4 bg-white rounded-full font-display font-bold transition ease-in-out duration-200 border-solid border border-gray-300;
    }

    .primary {
        @apply bg-primary text-white border-primary-700;
    }

    .clickable {
        @apply shadow-lg
    }

    .clickable:hover {
        @apply bg-gray-200;
    }

    .clickable.primary:hover {
        @apply bg-primary-500;
    }

    .clickable:active {
        @apply transform scale-95 shadow-none;
    }

    .pressed {
        @apply bg-gray-300 text-gray-500 border-gray-300
    }

    .pressed:hover {
        @apply bg-gray-300 !important
    }

    .disabled {
        @apply pressed
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
