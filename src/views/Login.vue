<template>
    <div class="login-page space-y-12">
        <img src="../assets/logo.svg" alt="Logo" class="logo"/>
        <Card class="login-card space-y-2">
            <Button
                    :icon-src="require('../assets/icons/google.svg')"
                    @click="doSocialSignIn('google')"
                    class="w-full">
                Sign in with Google
            </Button>

            <Button
                    :icon-src="require('../assets/icons/github.svg')"
                    @click="doSocialSignIn('github')"
                    class="githubButton">
                Sign in with GitHub
            </Button>
        </Card>
    </div>
</template>

<script>
    import Card from "../components/Card";
    import Button from "../components/Button";
    export default {
        name: "Login",
        components: {Button, Card},
        methods: {
            doSocialSignIn(using) {
                let provider

                if (using === 'google') provider = new this.$firebase.auth.GoogleAuthProvider()
                if (using === 'github') provider = new this.$firebase.auth.GithubAuthProvider()

                this.$firebase.auth().signInWithPopup(provider).then(() => {

                }).catch(e => {
                    console.log(e.message)
                })
            }
        }
    }
</script>

<style scoped>
    .login-page {
        @apply flex flex-col items-center;
    }

    .login-card {
        width: 20rem;
    }

    .logo {
        @apply h-24;
    }

    .githubButton {
        @apply w-full bg-gray-700 text-white;
    }

    .githubButton:hover {
        @apply bg-gray-600
    }
</style>
