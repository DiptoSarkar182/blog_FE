<template>
    <div class="login">
      <form @submit.prevent="handleLogin">
        <h1>Login</h1>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
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
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/users/sign_in', {
        user: {
          email: email.value,
          password: password.value
        }
      })
  
      if (response.data.status.code === 200) {
        // Assuming a successful login returns a 200 status code
        // Optionally, store the token in localStorage or Vuex store
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