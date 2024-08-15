<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md px-8 py-6 bg-white shadow-lg rounded-lg">
        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <h1 class="text-2xl font-bold text-center text-gray-800">Forgot Password</h1>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" v-model="email" required autocomplete="email"
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <button type="submit" :disabled="loading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit
          </button>
          <p v-if="message" class="mt-2 text-sm text-green-600">{{ message }}</p>
          <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
        </form>
        <div v-if="loading" class="spinner mt-4 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const email = ref('')
const message = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleForgotPassword = async () => {
  loading.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    const response = await axios.post(`${API_BASE_URL}/users/password`, {
      user: {
        email: email.value
      }
    })

    if (response.data.message) {
      message.value = response.data.message
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
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