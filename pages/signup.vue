<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign Up
      </h1>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="sr-only">Name</label>
            <input id="name" name="name" type="text" required v-model="name"
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Name">
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required v-model="password"
                   class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Password">
          </div>
        </div>
        <div>
          <button type="submit" :disabled="loading"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign Up
          </button>
        </div>
      </form>
      <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <div v-if="loading" class="spinner mt-4 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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