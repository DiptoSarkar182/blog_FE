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
      <button type="submit" :disabled="loading">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div v-if="loading" class="spinner"></div>
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
const loading = ref(false)
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.post(`${API_BASE_URL}/users/sign_in`, {
      user: {
        email: email.value,
        password: password.value
      }
    })

    if (response.data.status.code === 200) {
      localStorage.setItem('authToken', response.data.status.token)
      localStorage.setItem('userId', response.data.status.data.user.id)
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
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error {
  color: #ff0000;
  margin-top: 10px;
}

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