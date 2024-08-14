<template>
  <div>
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="loading">Sign Up</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div v-if="loading" class="spinner"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleSignup = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.post(`${API_BASE_URL}/users/sign_up`, {
      user: {
        name: name.value,
        email: email.value,
        password: password.value
      }
    })

    if (response.data.status.code === 200) {
      alert('Sign up is complete. Please login.')
      router.push('/login')
    } else {
      errorMessage.value = response.data.status.message
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.status && error.response.data.status.message) {
      errorMessage.value = error.response.data.status.message
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>