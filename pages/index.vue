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
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const user = ref(null)
  const isLoggedIn = ref(false)
  const router = useRouter()
  
  onMounted(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Fetch user details if token exists
      fetchUserDetails(token)
    }
  })
  
  const fetchUserDetails = async (token) => {
    try {
      // Replace with your actual API endpoint to fetch user details
      const response = await axios.get('http://127.0.0.1:3000/users/profile', {
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
        await axios.delete('http://127.0.0.1:3000/users/sign_out', {
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
  html, body {
    height: 100%;
    margin: 0;
  }
  
  .home {
    background-color: #42b983; /* Vue.js green background */
    color: #ffffff; /* White text color */
    height: 100vh; /* Full viewport height */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .btn {
    display: inline-block;
    padding: 10px 20px;
    background: #ffffff;
    color: #42b983;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;
  }
  
  .btn:hover {
    background: #ecf0f1;
  }
  </style>