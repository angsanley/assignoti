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
                        {{ channel.channelName }}
                    </Card>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import Card from "../../components/Card";
    import { SearchIcon } from 'vue-feather-icons'
    export default {
        name: "Subscriptions",
        components: {Card, SearchIcon},
        methods: {
            gotoChannel(id) {
                this.$router.push(`/dashboard/channels/${id}`)
            },
            getChannelsInfo(user) {
                // get channels info
                if (user) {
                    user['subscribedChannels'].forEach(channelKey => {
                        this.$firebase.database().ref(`channels/${channelKey}`).once('value').then(snapshot => {
                            this.$set(this.channels, channelKey, snapshot.val())
                        })
                    })
                }
            },
            getUserData(userObj) {
                // get user data
                const users = this.$firebase.database().ref('users')
                this.$rtdbBind('user', users.child(userObj.uid))
            },
            gotoExplore() {
                this.$router.push('/dashboard/channels')
            }
        },
        mounted() {
            this.$store.dispatch('getAuthenticatedUser')
            this.getUserData(this.userObj)
        },
        data() {
            return {
                user: {},
                channels: {}
            }
        },
        computed: {
            userObj() {
                return this.$store.state.user
            },
        },
        watch: {
            userObj(val) {
                this.getUserData(val)
            },
            user(val) {
                this.getChannelsInfo(val)
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
