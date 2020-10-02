<template>
    <div>
        <Card class="flex flex-col space-y-4 mt-2 h-full">
            <div class="flex space-x-4">
                <button :class="{'active-tab': currentTab === 'upcoming'}" class="text-sm" @click="upcomingTab">Upcoming tasks</button>
                <button :class="{'active-tab': currentTab === 'done'}" class="text-sm" @click="doneTab">Tasks done</button>
            </div>
            <div class="flex flex-col overflow-y-auto overflow-x-hidden h-full">
                <div v-if="currentTab === 'upcoming'" class="h-full">
                    <div class="grid place-items-center h-full text-center" v-if="sortedTasksList.length <= 0">Yay! No upcoming tasks yet.</div>

                    <TasksList :tasks-list="sortedTasksList" :channels="channels" :click="handleClick" v-on:check="handleCheckbox"/>

                </div>
                <div v-else class="h-full">
                    <div class="grid place-items-center h-full text-center" v-if="sortedDoneTasksList.length <= 0">Hey! You haven't done any tasks yet. Let's do some tasks, shall we?</div>

                    <TasksList :tasks-list="sortedDoneTasksList" :channels="channels" :click="handleClick" v-on:check="handleCheckbox"/>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    import moment from "moment"
    import Card from "../Card";
    import firebase from "firebase";
    import TasksList from "./UserTasksWidget/TasksList";
    export default {
        name: "UserTasksWidget",
        components: {TasksList, Card},
        props: ['tasksList'],
        data() {
            return {
                channels: {},
                currentTab: 'upcoming',
                tasks: {
                    upcoming: [],
                    done: []
                }
            }
        },
        filters: {
            timeFromNow(date) {
                return moment(date).fromNow()
            }
        },
        methods: {
            handleClick({channelId, taskKey}) {
                console.log({channelId, taskKey})
                this.$emit('click',  {channelId, taskKey})
            },
            handleCheckbox({checked, channelId, taskKey}) {
                // get channel key from channel id
                const dbRef = this.$firebase.database().ref('channels')
                dbRef.orderByChild('id').equalTo(channelId).limitToFirst(1).once('value').then(snapshot => {
                    const key = Object.keys(snapshot.val())[0]
                    const userId = this.user.uid

                    const taskUsersDoneRef = this.$firebase.database().ref(`channels/${key}/tasks/${taskKey}/usersDone/${userId}`)
                    if (checked) {
                        // set task as done
                        const taskDone = {
                            done: true,
                            dateDone: new Date().toISOString()
                        }
                        taskUsersDoneRef.set(taskDone)

                        // move task to done
                        for (let x=0; x<this.tasks.upcoming.length; ++x) {
                            let task = this.tasks.upcoming[x]
                            if (task['.key'] === taskKey) {
                                task.usersDone = task.usersDone ? task.usersDone : {}
                                task.usersDone[userId] = taskDone

                                this.tasks.done.push(task)
                                this.tasks.upcoming.splice(x, 1)
                                return
                            }
                        }

                    } else {
                        taskUsersDoneRef.set(null)

                        // move task to upcoming
                        for (let x=0; x<this.tasks.done.length; ++x) {
                            let task = this.tasks.done[x]
                            if (task['.key'] === taskKey) {
                                delete task.usersDone[userId]
                                this.tasks.upcoming.push(task)
                                this.tasks.done.splice(x, 1)
                                return
                            }
                        }
                    }
                })
            },
            upcomingTab() {
                this.currentTab = 'upcoming'
            },
            doneTab() {
                this.currentTab = 'done'
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
        mounted() {
        },
        computed: {
            sortedTasksList() {
                let sorted = this.tasks.upcoming
                sorted.sort((a, b) => {
                    return new Date(a.deadlineDate) - new Date(b.deadlineDate)
                })
                return sorted
            },
            sortedDoneTasksList() {
                let sorted = this.tasks.done
                sorted.sort((a, b) => {
                    return new Date(a.deadlineDate) - new Date(b.deadlineDate)
                })
                return sorted
            },
            user() {
                return this.$store.state.user
            }
        },
        watch: {
          tasksList(val) {
              this.tasks.upcoming = []
              this.tasks.done = []

              for (let x=0; x<val.length; ++x) {
                  const task = val[x]
                  if (this.checkTaskDone(task)) {
                      this.tasks.done.push(task)
                  } else {
                      this.tasks.upcoming.push(task)
                  }
              }
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

    .active-tab {
        @apply font-bold
    }
</style>
