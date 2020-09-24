<template>
    <div class="text-center space-y-2">
        <h3>New Task</h3>
        <div class="text-left flex flex-col items-center">
            <Card class="w-4/6 lg:w-2/6">
                <form @submit.prevent="addTask()" class="flex flex-col space-y-4">
                    <div>
                        <label for="task-name">Task name:</label>
                        <Input v-model="form.name" name="task-name" id="task-name" type="text" placeholder="Cook an egg fried rice" :required="true"/>
                    </div>
                    <div>
                        <label for="task-deadline">Deadline:</label>
                        <date-picker :min-date='new Date()' v-model="form.deadline">
                            <Input :value="form.deadline | dateFormat" name="task-deadline" id="task-deadline" type="text" placeholder="Task deadline" :required="true"/>
                        </date-picker>
                    </div>
                    <Button class="pt-4" primary><span class="text-center w-full">Add Task</span></Button>
                </form>
            </Card>
        </div>
    </div>
</template>

<script>
    import Input from "../components/Input";
    import Card from "../components/Card";
    import Button from "../components/Button";
    import DatePicker from 'v-calendar/lib/components/date-picker.umd'
    import moment from 'moment'
    export default {
        name: "NewTask",
        components: {Button, Card, Input, DatePicker},
        data() {
            return {
                form: {
                    name: '',
                    deadline: new Date()
                },
                channelId: 0,
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            }
        },
        methods: {
            bindChannel(channelId) {
                const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

                this.$rtdbBind('channel', dbQuery).catch(e => {
                    console.log(e.message)
                })
            },
            addTask() {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${this.channelKey}/tasks`)

                const pushData = {
                    name: this.form.name,
                    deadlineDate: this.form.deadline.toISOString(),
                    author: this.$firebase.auth().currentUser.uid
                }

                dbRef.push(pushData).then(() => {
                    this.$router.push(`/channels/${this.channelId}`)
                }).catch(e => {
                    alert('error')
                    console.log(e.message)
                })
            }
        },
        filters: {
            dateFormat(date) {
                return moment(date).format("MMM Do YYYY")
            }
        },
        mounted() {
            if (!parseInt(this.$route.params.id)) {
                this.$router.push('/')
            } else {
                this.channelId = parseInt(this.$route.params.id)
            }
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
        }
    }
</script>

<style scoped>

</style>
