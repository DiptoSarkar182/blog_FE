<template>
  <div>
    <header class="bg-gray-800 text-white p-4">
      <nav class="flex justify-between items-center">
        <div class="text-2xl font-bold">
          <NuxtLink to="/" class="text-white hover:text-gray-300">BlogWebsite</NuxtLink>
        </div>
        <div class="space-x-4">
          <NuxtLink v-if="!isLoggedIn" to="/login" class="text-white hover:text-gray-300">Login</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/signup" class="text-white hover:text-gray-300">Signup</NuxtLink>
          <a v-if="isLoggedIn" @click="logout" class="btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Logout</a>
        </div>
      </nav>
    </header>
    <div v-if="isLoading" class="loading-message text-center mt-4 text-lg text-gray-700">
      Please wait, waking up backend server...
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '../store'

const { isLoggedIn } = useAuth()
const router = useRouter()
const isLoading = ref(true)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const checkBackendStatus = async (retryCount = 0) => {
  try {
    await axios.get(`${API_BASE_URL}/status`)
    isLoading.value = false
  } catch (error) {
    console.error('Backend is still waking up:', error)
    const delay = Math.min(3000 * 2 ** retryCount, 30000) // Exponential backoff with a max delay of 30 seconds
    setTimeout(() => checkBackendStatus(retryCount + 1), delay)
  }
}

provide('isLoggedIn', isLoggedIn)

onMounted(() => {
  if (process.client) {
    isLoggedIn.value = !!localStorage.getItem('authToken')
    checkBackendStatus()
  }
})

const logout = () => {
  if (process.client) {
    localStorage.removeItem('authToken')
    isLoggedIn.value = false
    router.push('/login')
  }
}
</script>

<style scoped>
.loading-message {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  color: #333;
}
</style>