<template>
    <div class="text-center space-y-2">
        <add-channel-modal/>
        <h3>Your channels</h3>
        <div class="channels">
            <button @click="addNewChannel()">
                <Card class="item add-item space-y-2">
                    <PlusIcon/>
                    <span>Add new channel</span>
                </Card>
            </button>

            <button v-for="channel in channels" :key="channel.id">
                <Card class="item">
                    {{ channel.name }}
                </Card>
            </button>
        </div>
    </div>
</template>

<script>
    import Card from "../components/Card";
    import { PlusIcon } from 'vue-feather-icons'
    import AddChannelModal from "../components/AddChannelModal";
    export default {
        name: "Channels",
        components: {AddChannelModal, Card, PlusIcon},
        methods: {
          addNewChannel() {
              this.$modal.show('add-channel-modal')
          }
        },
        data() {
            return {
                channels: [
                    { id: 0, name: "COMP6153 - Operating System (LA03)" }
                ]
            }
        }
    }
</script>

<style scoped>
    .channels {
        @apply flex flex-wrap items-center justify-center;
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
