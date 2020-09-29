<template>
    <div>
        <Card class="flex flex-col space-y-4 mt-2 h-full">
            <div>Upcoming tasks</div>
            <div class="flex flex-col space-y-2 overflow-y-auto">
                <div v-for="task in sortedTasksList" :key="task['.key']" class="item">
                    <div class="flex space-x-4">
                        <div>
                            <input type="checkbox" @change="handleCheckbox($event, channels[task.channelKey].id, task['.key'])"/>
                        </div>
                        <button class="text-left w-full" @click="handleClick(channels[task.channelKey].id, task['.key'])">
                            <div class="flex flex-col truncate">
                                <div class="text-sm" v-if="channels[task.channelKey]">{{ channels[task.channelKey].channelName }}</div>
                                <div class="font-display font-bold">{{ task.name }}</div>
                                <div class="text-sm">{{ task.deadlineDate | timeFromNow }}</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    import moment from "moment"
    import Card from "../Card";
    import firebase from "firebase";
    export default {
        name: "UserTasksWidget",
        components: {Card},
        props: ['tasksList'],
        data() {
            return {
                channels: {}
            }
        },
        filters: {
            timeFromNow(date) {
                return moment(date).fromNow()
            }
        },
        methods: {
            handleClick(channelId, taskKey) {
                this.$emit('click',  {channelId, taskKey})
            },
            handleCheckbox(event, channelId, taskKey) {
                console.log({value: event.target.checked, channelId, taskKey})
            }
        },
        mounted() {
        },
        computed: {
            sortedTasksList() {
                let sorted = this.tasksList
                sorted.sort((a, b) => {
                    return new Date(a.deadlineDate) - new Date(b.deadlineDate)
                })
                return sorted
            }
        },
        firebase: {
            //TODO: do not fetch all channels, this is not a good idea
            channels: firebase.database().ref('channels/')
        },
    }
</script>

<style scoped>
    .item {
        @apply bg-gray-200 py-2 px-4 rounded-lg transition ease-in-out duration-200
    }

    .item:hover {
        @apply transform bg-gray-400
    }
</style>
