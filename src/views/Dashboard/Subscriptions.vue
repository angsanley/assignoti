<template>
    <div class="flex justify-center">
        <div class="container space-y-4">
            <div>
                <h1>Your subscriptions</h1>
                <p>The tasks of the channels you subscribed will appear on your dashboard. You will also receive notifications about them.</p>
            </div>
            <div class="subscriptions">
                <button @click="gotoExplore()">
                    <Card class="item add-item space-y-2">
                        <SearchIcon/>
                        <span>Explore channels</span>
                    </Card>
                </button>

                <button v-for="channel in channels" :key="channel.id" @click="gotoChannel(channel.id)">
                    <Card class="item">
                        <span v-if="channel.channelName">{{ channel.channelName }}</span>
                        <span v-else>Loading...</span>
                    </Card>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import Card from "../../components/Card";
    import { SearchIcon } from 'vue-feather-icons'
    import {objectToArray} from "../../utils/ObjectToArray";
    export default {
        name: "Subscriptions",
        components: {Card, SearchIcon},
        data() {
            return {
                channels: {}
            }
        },
        methods: {
            gotoChannel(id) {
                this.$router.push(`/dashboard/channels/${id}`)
            },
            gotoExplore() {
                this.$router.push('/dashboard/channels')
            },
            loadSubscriptionsData(subscriptions) {
                for (let x=0; x<subscriptions.length; ++x) {
                    const obj = subscriptions[x]
                    const channelKey = obj.channelKey
                    this.$set(this.channels, channelKey, obj)
                    this.fetchChannelInfo(obj)
                }
            },
            fetchChannelInfo({channelKey}) {
                this.$firebase.database().ref(`channels/${channelKey}`).once('value').then(snapshot => {
                    this.$set(this.channels, channelKey, snapshot.val())
                })
            }
        },
        mounted() {
            //bind subscriptions
            this.$store.dispatch('bindSubscriptions')
        },
        computed: {
            subscriptionsArray() {
                return objectToArray(this.$store.state.subscriptions)
            }
        },
        watch: {
            subscriptionsArray(newVal) {
                this.loadSubscriptionsData(newVal)
            }
        }
    }
</script>

<style scoped>
    .subscriptions {
        @apply flex flex-wrap items-center;
    }

    .subscriptions > button {
        @apply m-2 w-56 h-32 transition ease-in-out duration-200
    }

    .subscriptions > button:active {
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
