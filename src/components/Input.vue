<template>
    <input ref="input" @input="handleInput()" :name="name" :id="id" :disabled="disabled" :maxlength="maxlength"
           class="rounded-lg py-2 px-4 bg-gray-300 placeholder-gray-600 w-full" :value="value" :required="required" :type="type" :placeholder="placeholder"/>
</template>

<script>
    export default {
        name: "Input",
        props: ['required', 'placeholder', 'value', 'type', 'name', 'id', 'disabled', 'maxlength'],
        methods: {
            handleInput() {
                this.$emit('input', this.$refs.input.value)
            }
        }
    }
</script>

<style scoped>
</style>
