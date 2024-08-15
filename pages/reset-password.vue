<!-- pages/reset-password.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reset Password
      </h1>
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="password" class="sr-only">New Password</label>
            <input id="password" name="password" type="password" required v-model="password"
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="New Password">
          </div>
          <div>
            <label for="password_confirmation" class="sr-only">Confirm Password</label>
            <input id="password_confirmation" name="password_confirmation" type="password" required v-model="passwordConfirmation"
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Confirm Password">
          </div>
        </div>
        <div>
          <button type="submit" :disabled="loading"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Reset Password
          </button>
        </div>
      </form>
      <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="mt-2 text-center text-sm text-green-600">
        {{ successMessage }}
      </p>
      <div v-if="loading" class="spinner mt-4 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const password = ref('')
const passwordConfirmation = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const resetPasswordToken = route.query.reset_password_token

const handleResetPassword = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!resetPasswordToken) {
    errorMessage.value = 'Invalid or missing token.'
    loading.value = false
    return
  }

  try {
    // Reset the password
    const response = await axios.put(`${API_BASE_URL}/users/password`, {
      user: {
        reset_password_token: resetPasswordToken,
        password: password.value,
        password_confirmation: passwordConfirmation.value
      }
    })

    console.log('Response:', response)

    if (response.status === 200 && response.data.message) {
      successMessage.value = response.data.message
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = response.data.message || 'An error occurred. Please try again.'
    }
  } catch (error) {
    console.error('Error:', error)
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
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