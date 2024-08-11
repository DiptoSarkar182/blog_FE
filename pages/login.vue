<template>
  <div class="login">
    <form @submit.prevent="handleLogin">
      <h1>Login</h1>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required autocomplete="email"/>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/sign_in`, {
      user: {
        email: email.value,
        password: password.value
      }
    })

    if (response.data.status.code === 200) {
      localStorage.setItem('authToken', response.data.status.token)
      router.push('/')
    } else {
      errorMessage.value = response.data.status.message || 'Invalid email or password'
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.status) {
      errorMessage.value = error.response.data.status.message
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }
  }
}
</script>
  
  <style scoped>
  .error {
    color: #ff0000;
    margin-top: 10px;
  }
  </style>