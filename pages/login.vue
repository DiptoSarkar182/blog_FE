<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md px-8 py-6 bg-white shadow-lg rounded-lg">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <h1 class="text-2xl font-bold text-center text-gray-800">Login</h1>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input type="email" v-model="email" required autocomplete="email"
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input type="password" v-model="password" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="remember_me" class="inline-flex items-center">
            <input type="checkbox" v-model="rememberMe" class="form-checkbox">
            <span class="ml-2 text-sm text-gray-600">Remember Me</span>
          </label>
        </div>
        <button type="submit" :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Login
        </button>
        <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
      </form>
      <div v-if="loading" class="spinner mt-4 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      <div class="mt-4 text-center">
        <NuxtLink to="/forgot_password" class="text-sm text-blue-600 hover:underline">Forgot Password?</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
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
        password: password.value,
        remember_me: rememberMe.value
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

onMounted(() => {
  const authToken = localStorage.getItem('authToken')
  if (authToken) {
    router.push('/')
  }
})
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