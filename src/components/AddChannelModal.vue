<template>
    <modal name="add-channel-modal" :min-width="350" :min-height="400" height="auto" :width="350">
        <form class="flex flex-col space-y-6 m-4">
            <h5 class="text-primary">Add new channel</h5>
            <div class="flex flex-col space-y-1">
                <label for="channel" class="text-left">Channel name:</label>
                <Input type="text" id="channel" name="channel" :required="true" placeholder="Egg Fried Rice"/>
            </div>
            <Button primary>
                <div class="text-center w-full">
                    Add Channel
                </div>
            </Button>
        </form>
    </modal>
</template>

<script>
    import Button from "./Button";
    import Input from "./Input";
    export default {
        name: "AddChannelModal",
        components: {Input, Button}
    }
</script>

<style scoped>

</style>
