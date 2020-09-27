<template>
    <div class="flex justify-center">
        <div class="container space-y-4">
            <div>
                <h1>Explore channels</h1>
                <p>Find channels here and subscribe to it.</p>
            </div>
        <div class="channels">
            <button @click="addNewChannel()">
                <Card class="item add-item space-y-2">
                    <PlusIcon/>
                    <span>Add new channel</span>
                </Card>
            </button>

            <button v-for="channel in channels" :key="channel.id" @click="gotoChannel(channel.id)">
                <Card class="item">
                    {{ channel.channelName }}
                </Card>
            </button>
        </div>
        <add-channel-modal/>
        </div>
    </div>
</template>

<script>
    import Card from "../../components/Card";
    import { PlusIcon } from 'vue-feather-icons'
    import AddChannelModal from "../../components/AddChannelModal";
    import firebase from "firebase/app"

    export default {
        name: "Channels",
        components: {AddChannelModal, Card, PlusIcon},
        methods: {
            addNewChannel() {
                this.$modal.show('add-channel-modal')
            },
            gotoChannel(id) {
                this.$router.push(`/dashboard/channels/${id}`)
            }
        },
        data() {
            return {
                channels: []
            }
        },
        firebase: {
            channels: firebase.database().ref('channels/')
        },
    }
</script>

<style scoped>
    .channels {
        @apply flex flex-wrap items-center;
    }

    .channels > button {
        @apply m-2 w-56 h-32 transition ease-in-out duration-200
    }

    .channels > button:active {
        @apply transform scale-95
    }

    .item {
        @apply flex flex-col items-center justify-center w-full h-full transition ease-in-out duration-200
    }

    .item:hover {
        @apply bg-gray-200 border border-gray-400
    }

    .add-item {
        @apply text-primary
    }
</style>
