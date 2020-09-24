<template>
    <div class="text-center space-y-2">
        <h3>New Task</h3>
        <div class="text-left flex flex-col items-center">
            <Card class="w-4/6 lg:w-2/6">
                <form class="flex flex-col space-y-4">
                    <div>
                        <label for="task-name">Task name:</label>
                        <Input name="task-name" id="task-name" type="text" placeholder="Cook an egg fried rice"/>
                    </div>
                    <div>
                        <label for="task-deadline">Deadline:</label>
                        <date-picker :min-date='new Date()' v-model="form.deadline">
                            <Input :value="form.deadline | dateFormat" name="task-deadline" id="task-deadline" type="text" placeholder="Task deadline"/>
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
            }
        },
        filters: {
            dateFormat(date) {
                return moment(date).format("MMM Do YYYY")
            }
        }
    }
</script>

<style scoped>

</style>
