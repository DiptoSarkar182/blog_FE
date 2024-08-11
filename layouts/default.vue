<template>
  <div>
    <header>
      <nav>
        <div class="logo">
          <NuxtLink to="/">BlogWebsite</NuxtLink>
        </div>
        <div class="nav-links">
          <NuxtLink v-if="!isLoggedIn" to="/login">Login</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/signup">Signup</NuxtLink>
          <a v-if="isLoggedIn" @click="logout" class="btn">Logout</a>
        </div>
      </nav>
    </header>
    <div v-if="isLoading" class="loading-message">
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