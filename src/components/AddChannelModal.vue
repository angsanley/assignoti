<template>
    <modal name="add-channel-modal" :min-width="350" :min-height="400" height="auto" :width="350">
        <form class="flex flex-col space-y-6 m-4" @submit.prevent="submitForm()">
            <h5 class="text-primary">Add new channel</h5>
            <div class="flex flex-col space-y-1">
                <label for="channel" class="text-left">Channel name:</label>
                <Input v-model="form.channelName" type="text" id="channel" name="channel" :required="true" placeholder="Egg Fried Rice"/>
                <span v-if="errorMessage" class="text-left text-red-500">{{ errorMessage }}</span>
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
    import * as stringHash from "string-hash";
    export default {
        name: "AddChannelModal",
        components: {Input, Button},
        data() {
            return {
                form: {
                    id: 0,
                    channelName: '',
                    owners: [this.$firebase.auth().currentUser.uid]
                },
                errorMessage: ''
            }
        },
        methods: {
            submitForm() {
                const db = this.$firebase.database()
                const dbRef = db.ref('channels')
                this.form.id = stringHash(dbRef.push().getKey())
                const payload = JSON.parse(JSON.stringify(this.form))

                dbRef.push(payload).then(() => {
                    this.$emit('close')
                }).catch(e => {
                    this.errorMessage = e.message
                })
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
