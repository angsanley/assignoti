<template>
    <div class="flex justify-center">
        <div class="container">
            <h1 v-if="user">Hello, {{ user.displayName }}!</h1>

            <div class="flex flex-col space-y-4 space-x-0 xl:flex-row xl:justify-between xl:space-x-4 xl:space-y-0">
                <user-tasks-widget class="widget w-full" v-if="this.tasksList.length > 0" :tasks-list="this.tasksList" @click="handleTaskClick"/>
            </div>
        </div>
    </div>
</template>

<script>
    import UserTasksWidget from "../../components/Dashboard/UserTasksWidget";
    export default {
        name: "DashboardHome",
        components: {UserTasksWidget},
        data() {
            return {
                tasksList: []
            }
        },
        mounted() {
            this.$store.dispatch('getAuthenticatedUser')
            this.$store.dispatch('bindUserData')
        },
        computed: {
            user() {
                return this.$store.state.user
            },
            userData() {
                return this.$store.state.userData
            },
            subscribedChannels() {
                return this.userData ? this.userData.subscribedChannels : []
            },
        },
        watch: {
            subscribedChannels(val) {
                // get tasks list
                this.getTasksList(val)
            }
        },
        methods: {
            getTasksList(channels) {
                for (let x=0; x<channels.length; ++x) {
                    const channelKey = channels[x]
                    const dbRef = this.$firebase.database().ref(`/channels/${channelKey}/tasks`)

                    dbRef.once('value').then(snapshot => {
                        const tasksObj = snapshot.val()
                        const keys = Object.keys(tasksObj)

                        // iterate every task object
                        for (let y=0; y<keys.length; ++y) {
                            let task = tasksObj[keys[y]]
                            if (Date.parse(task.deadlineDate) < Date.parse(Date())) continue // skip past tasks
                            task['.key'] = keys[y]
                            task.channelKey = channelKey
                            delete task.description // remove unused description
                            this.tasksList.push(task)
                        }
                    })
                }
            },
            handleTaskClick(task) {
                this.$router.push(`/channels/${task.channelId}/task/${task.taskKey}`)
            }
        }
    }
</script>

<style scoped>
    .widget {
        height: 24rem;
    }
</style>
