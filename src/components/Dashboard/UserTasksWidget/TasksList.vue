<template>
    <div class="space-y-2">
        <div v-for="task in tasksList" :key="task['.key']" class="item">
            <div class="flex space-x-4">
                <div>
                    <input :checked="checkTaskDone(task)" type="checkbox" @change="handleCheckbox($event, channels[task.channelKey].id, task['.key'])"/>
                </div>
                <div>
                    <router-link v-if="channels[task.channelKey]" class="text-sm" :to="`/dashboard/channels/${channels[task.channelKey].id}`">
                        {{ channels[task.channelKey].channelName }}
                    </router-link>

                    <button class="text-left w-full" @click="handleClick(channels[task.channelKey].id, task['.key'])">
                        <div class="flex flex-col truncate">
                            <div class="font-display font-bold">{{ task.name }}</div>
                            <div class="text-sm" v-if="checkTaskDone(task)">Done {{ task.deadlineDate | timeFromNow }}</div>
                            <div class="text-sm" v-else>Due {{ task.deadlineDate | timeFromNow }}</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";

    export default {
        name: "TasksList",
        props: ['tasksList', 'channels'],
        methods: {
            handleClick(channelId, taskKey) {
                this.$emit('click',  {channelId, taskKey})
            },
            handleCheckbox(event, channelId, taskKey) {
                this.$emit('check',  {checked: event.target.checked, channelId, taskKey})
            },
            checkTaskDone(task) {
                if (task) {
                    if (task.usersDone) {
                        if (task.usersDone[this.user.uid]) {
                            return task.usersDone[this.user.uid].done
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        filters: {
            timeFromNow(date) {
                return moment(date).fromNow()
            }
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
