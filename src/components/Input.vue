<template>
    <input v-if="!textarea" ref="input" @input="handleInput()" :name="name" :id="id" :disabled="disabled" :maxlength="maxlength"
           class="rounded-lg py-2 px-4 bg-gray-300 placeholder-gray-600 w-full" :value="value" :required="required" :type="type" :placeholder="placeholder"/>
    <textarea v-else
        ref="input" 
        rows="3"
        @input="handleInput()" 
        :name="name" 
        :id="id" 
        :disabled="disabled" 
        :value="value" 
        :placeholder="placeholder"
        class="rounded-lg py-2 px-4 bg-gray-300 placeholder-gray-600 w-full" 
    />
</template>

<script>
    export default {
        name: "Input",
        props: ['required', 'placeholder', 'value', 'type', 'name', 'id', 'disabled', 'maxlength', 'textarea'],
        methods: {
            handleInput() {
                this.$emit('input', this.$refs.input.value)
            }
        }
    }
</script>

<style scoped>
</style>
