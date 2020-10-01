<template>
    <div>
        <div class="px-4 lg:px-16">
            <div class="flex flex-col-reverse lg:flex-row lg:items-baseline">
                <Card class="lg:w-2/4 m-2 p-2 break-words">
                    <vue-markdown :source="task.description"/>
                </Card>
                <div class="flex flex-col lg:w-2/4">
                    <Card class="m-2 p-2 space-y-2">
                        <div class="card-title">{{ task.name }}</div>
                        <div>
                            <div class="flex items-center space-x-2"><BookIcon size="1x"/> <div>{{ channel[channelKey]['channelName'] }}</div></div>
                            <div class="flex items-center space-x-2"><CalendarIcon size="1x"/> <div>{{ task.deadlineDate | dateFormat }}</div></div>
                            <div class="flex items-center space-x-2"><UserIcon size="1x"/> <div>Posted by {{ task.authorName }}</div></div>
                        </div>
                    </Card>
                    <Card class="m-2 p-2 space-y-2">
                        <div class="card-title">Discussions</div>
                        <div class="w-full"
                            v-for="({ timestamp, author, content }, i) in discussions" 
                            :key="`#post-${timestamp}-${i}`"
                        >

                        </div>
                        <Input 
                            v-model="discussionContent"
                            name="task-name" 
                            id="task-name" 
                            type="text" 
                            placeholder="Got anything in your mind?" 
                            :textarea="true"  
                        />
                        <Button @click="makePost()" class="pt-4 w-full" primary>
                            <span class="text-center w-full">Post</span>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>

        <floating-action-button primary @click="gotoEditTask()" v-if="user"><EditIcon/></floating-action-button>
    </div>
</template>

<script>
    import moment from "moment"
    import VueMarkdown from "vue-markdown"
    import Card from "../../components/Card"
    import { CalendarIcon, BookIcon, UserIcon, EditIcon } from 'vue-feather-icons'
    import FloatingActionButton from "../../components/FloatingActionButton"
    import Button from '@/components/Button'
    import Input from '@/components/Input'

    export default {
        name: "ViewTask",
        components: {FloatingActionButton, Card, VueMarkdown, CalendarIcon, BookIcon, UserIcon, EditIcon, Input, Button},
        data() {
            return {
                task: {
                    name: '',
                    deadline: new Date(),
                    description: '',
                    authorName: ''
                },
                discussions: [],
                channel: {},
                channelId: 0,
                discussionContent: '',
                taskKey: null,
                firebaseTaskData: null,
                firebaseAuthorData: null,
                firebaseDiscussionData: null
            }
        },
        computed: {
            channelKey() {
                return Object.keys(this.channel)[0]
            },
            user() {
                return this.$store.state.user
            }
        },
        methods: {
            bindChannel(channelId) {
                const dbQuery = this.$firebase.database().ref('channels').orderByChild('id').equalTo(channelId).limitToFirst(1)

                this.$rtdbBind('channel', dbQuery).catch(e => {
                    console.log(e.message)
                })
            },
            bindTask(channelKey, taskKey) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${channelKey}/tasks/${taskKey}`)
                this.$rtdbBind('firebaseTaskData', dbRef)
            },
            bindDiscussion(channelKey, taskKey) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${channelKey}/tasks/${taskKey}/discussions`)
                this.$rtdbBind('firebaseDiscussionData', dbRef)
            },
            gotoEditTask() {
                this.$router.push(`/channels/${this.channelId}/task/${this.taskKey}/edit`)
            },
            bindAuthor(authorUid) {
                const db = this.$firebase.database()
                const dbRef = db.ref(`users/${authorUid}`)
                this.$rtdbBind('firebaseAuthorData', dbRef)
            },
            makePost() {
                const db = this.$firebase.database()
                const dbRef = db.ref(`channels/${this.channelKey}/tasks/${this.taskKey}/discussions`)

                const dataToPush = {
                    author: this.$firebase.auth().currentUser.uid,
                    timestamp: (new Date()).toISOString(),
                    content: this.discussionContent
                };

                dbRef.push(dataToPush)
                    .then(() => {
                        this.discussionContent = ''
                    })
                    .catch(e => {
                        alert('ngeri')
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

            // get task key from url if present
            if (this.$route.params.taskKey) {
                this.taskKey = this.$route.params.taskKey
            }

            // get current user
            this.$store.dispatch('getAuthenticatedUser')
        },
        watch: {
            channelId(val) {
                this.bindChannel(val)
            },
            channel() {
                if (this.taskKey) {
                    this.bindTask(this.channelKey, this.taskKey)
                    this.bindDiscussion(this.channelKey, this.taskKey)
                }
            },
            form() {
                console.log(this.form.deadline)
            },
            firebaseTaskData(val) {
                // update form data with firebase 
                this.task.name = val.name
                this.task.deadline = new Date(val.deadlineDate)
                this.task.description = val.description

                // bind author data
                if (!this.firebaseAuthorData) this.bindAuthor(val.author)
            },
            firebaseAuthorData(val) {
                this.task.authorName = val.displayName
            },
            firebaseDiscussionData(val) {
                this.discussions = Object.values(val)
            }
        }
    }
</script>

<style scoped>
    .card-title {
        @apply font-bold font-display break-words text-xl;
    }
</style>
