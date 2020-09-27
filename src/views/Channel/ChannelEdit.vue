<template>
    <div class="text-center space-y-2">
        <h3 v-if="channel">{{ channel[channelKey].channelName }}</h3>

        <div class="space-y-2 pt-4">
            <span class="font-medium" v-if="upcomingTasks.length > 0">Upcoming tasks:</span>
            <div class="flex flex-col items-center" v-for="task in upcomingTasks" :key="task['.key']">
                <button class="w-5/6 lg:w-3/6 selectable" @click="gotoTask(task['.key'])">
                    <Card class="item">
                        <div class="font-bold font-display truncate">{{ task.name }}</div>
                        <div class="text-sm flex items-center space-x-2"><CalendarIcon size="1x"/> <div>{{ task.deadlineDate | dateFormat }}</div></div>
                    </Card>
                </button>
            </div>
        </div>

        <div class="space-y-2 pt-4">
            <span class="font-medium" v-if="pastTasks.length > 0">Past tasks:</span>
            <div class="flex flex-col items-center" v-for="task in pastTasks" :key="task['.key']">
                <button class="w-5/6 lg:w-3/6 selectable" @click="gotoTask(task['.key'])">
                    <Card class="item">
                        <div class="font-bold font-display truncate">{{ task.name }}</div>
                        <div class="text-sm flex items-center space-x-2"><CalendarIcon size="1x"/> <div>{{ task.deadlineDate | dateFormat }}</div></div>
                    </Card>
                </button>
            </div>
        </div>

        <floating-action-button primary @click="addNewTask()" v-if="user"><PlusIcon/></floating-action-button>
    </div>
</template>

<script>
    import Card from "../../components/Card";
    import moment from "moment"
    import { CalendarIcon, PlusIcon } from 'vue-feather-icons'
    import FloatingActionButton from "../../components/FloatingActionButton";
    export default {
        name: "ChannelEdit",
        components: {FloatingActionButton, Card, CalendarIcon, PlusIcon},
        data() {
            return {
                channel: {},
                tasks: [],
                channelId: 0,
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            },
            upcomingTasks() {
                let upcomingTasks = []
                this.tasks.forEach(task => {
                    if (moment().diff(task.deadlineDate, 'days') <= 0) upcomingTasks.push(task)
                })
                return upcomingTasks
            },
            pastTasks() {
                let pastTasks = []
                this.tasks.forEach(task => {
                    if (moment().diff(task.deadlineDate, 'days') > 0) pastTasks.push(task)
                })
                return pastTasks
            },
            user() {
                return this.$store.state.user
            },
        },
        mounted() {
            if (!parseInt(this.$route.params.id)) {
                this.$router.push('/')
            } else {
                this.channelId = parseInt(this.$route.params.id)

                // get current user
                this.$store.dispatch('getAuthenticatedUser')
            }
        },
        methods: {
            bindChannel(channelId) {
                const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

                this.$rtdbBind('channel', dbQuery).catch(e => {
                    console.log(e.message)
                })
            },
            addNewTask() {
                this.$router.push(`/channels/${this.channelId}/task/new`)
            },
            populateTasks() {
                const tasksObj = this.channel[this.channelKey]['tasks']
                const keys = Object.keys(tasksObj)
                this.tasks = []

                keys.forEach(key => {
                    // get single task
                    tasksObj[key]['.key'] = key
                    this.tasks.push(tasksObj[key])
                })
            },
            gotoTask(taskKey) {
                this.$router.push(`/channels/${this.channelId}/task/${taskKey}`)
            }
        },
        filters: {
            dateFormat(date) {
                return moment(date).format("MMM Do YYYY")
            }
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
            channel() {
                this.populateTasks()
            }
        },
    }
</script>

<style scoped>
    .item {
        @apply flex flex-col text-left w-full h-full transition ease-in-out duration-200
    }

    .item:hover {
        @apply bg-gray-200 border border-gray-400
    }

    .selectable {
        @apply transition ease-in-out duration-200
    }

    .selectable:active {
        @apply transform scale-95
    }
</style>
