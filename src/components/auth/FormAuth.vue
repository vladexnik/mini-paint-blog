<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { toast } from 'vue3-toastify'

const email = ref('')
const password = ref('')

const errMsg = ref('')
const userStore = useUserStore()
const route = useRoute()

defineProps(['title', 'btn', 'text', 'link', 'action'])

// interface LoginData {
//   email: string
//   password: string
// }

const handleSubmitSignUp = async () => {
  try {
    await userStore.signUp(email.value, password.value)
  } catch (error: any) {
    console.log(error.code, 'err')
    toast.error('Login error. Reload the page')
  }
}

const handleSubmitLogin = async () => {
  try {
    await userStore.login(email.value, password.value)
  } catch (error: any) {
    console.log(error.code, 'err')
    toast.error('Login error. Reload the page')
  }
}

const formAction = () => (route.path === '/login' ? handleSubmitLogin() : handleSubmitSignUp())
</script>

<template>
  <div class="wrapper">
    <div class="title">{{ title }}</div>
    <form @submit.prevent="formAction">
      <div class="field">
        <input type="text" placeholder="Email Address" v-model="email" required />
        <label></label>
      </div>
      <div class="field">
        <input
          type="password"
          name="password"
          autocomplete="on"
          placeholder="Password"
          v-model="password"
          required
        />
      </div>
      <p class="message" v-if="errMsg">{{ errMsg }}</p>

      <div class="field btn">
        <input type="submit" :value="btn" />
      </div>
      <div class="signup-link">
        {{ text }}
        <router-link :to="link">{{ action }} now</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.wrapper {
  margin: 0 auto;
  margin-top: 70px;
  max-width: 380px;
  background: var(--white-color);
  border-radius: 15px;
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.1);
}
.wrapper .title {
  font-size: 35px;
  font-weight: 600;
  text-align: center;
  line-height: 100px;
  color: white;
  user-select: none;
  border-radius: 15px 15px 0 0;
  background: linear-gradient(-90deg, var(--orange-color), var(--red-color));
}
.wrapper form {
  padding: 10px 30px 50px 30px;
  background-color: white;
}
.wrapper form .field {
  height: 50px;
  width: 100%;
  margin-top: 20px;
  position: relative;
}
.wrapper form .field input {
  height: 100%;
  width: 100%;
  outline: none;
  font-size: 16px;
  padding: 0 15px;
  border: 1px solid var(--grey-color);
  border-radius: 25px;
  transition: all 0.3s ease;
}
.wrapper form .field input:focus,
form .field input:valid {
  border-color: grey;
}

form .content label {
  color: var(--dark-color);
  user-select: none;
  padding-left: 5px;
}

form .field input[type='submit'] {
  color: white;
  border: none;
  padding-left: 0;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(-90deg, var(--orange-color), var(--red-color));
  transition: all 0.3s ease;
}
form .field input[type='submit']:active {
  transform: scale(0.95);
}
form .signup-link {
  margin-top: 20px;
  text-align: center;
}
form .pass-link a,
form .signup-link a {
  color: var(--orange-color);
  text-decoration: none;
}
form .pass-link a:hover,
form .signup-link a:hover {
  text-decoration: underline;
}

.message {
  text-align: left;
  padding-left: 10px;
  font-weight: 600;
  color: var(--red-color);
}
</style>
