<template>
  <div class="home">
    <header>
      <h1 v-if="isLoggedIn">Hello, {{ user.name }} ({{ user.email }})</h1>
      <h1 v-else>Welcome to My Website</h1>
      <p>Your one-stop solution for all your needs.</p>
      <div v-if="isLoggedIn">
        <button @click="handleLogout" class="btn">Logout</button>
      </div>
      <div v-else>
        <NuxtLink to="/login" class="btn">Login</NuxtLink>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '../store'

const user = ref(null)
const { isLoggedIn } = useAuth()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

onMounted(() => {
  const token = localStorage.getItem('authToken')
  if (token) {
    fetchUserDetails(token)
  }
})

const fetchUserDetails = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 200) {
      user.value = response.data.user
      isLoggedIn.value = true
    }
  } catch (error) {
    console.error('Failed to fetch user details:', error)
    handleLogout()
  }
}

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('authToken')
    if (token) {
      await axios.delete(`${API_BASE_URL}/users/sign_out`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      localStorage.removeItem('authToken')
      user.value = null
      isLoggedIn.value = false
      router.push('/')
    }
  } catch (error) {
    console.error('Failed to logout:', error)
  }
}
</script>
  
  <style scoped>
  /* Add your styles here */
  </style>