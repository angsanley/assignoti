<template>
    <div class="text-center space-y-2">
        <h3 v-if="channel">{{ channel[channelKey].channelName }}</h3>
        <div>
            {{ channel[channelKey]['tasks'] }}
        </div>
        <Button @click="addNewTask()">Add new task</Button>
    </div>
</template>

<script>
    import Button from "../components/Button";
    export default {
        name: "ChannelEdit",
        components: {Button},
        data() {
            return {
                channel: {},
                channelId: 0,
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            }
        },
        mounted() {
            if (!parseInt(this.$route.params.id)) {
                this.$router.push('/')
            } else {
                this.channelId = parseInt(this.$route.params.id)
            }
        },
        methods: {
            bindChannel(channelId) {
                const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

                this.$rtdbBind('channel', dbQuery).catch(e => {
                    console.log(e.message)
                })
            },
            // addTask(name, deadline, attachment) {
            //     // make sure channel is not null
            //     if (!this.channel) return
            //
            //     const dbRef = this.$firebase.database().ref(`channels/${this.channelKey}/tasks`)
            //     const pushKey = dbRef.push().getKey()
            //
            //     // push into db
            //     dbRef.push({
            //         name,
            //         deadline
            //     })
            //
            //     // upload attachment
            //
            // },
            addNewTask() {
                this.$router.push(`/channels/${this.channelId}/new-task`)
            }
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
            channel() {
            }
        }
    }
</script>

<style scoped>

</style>
