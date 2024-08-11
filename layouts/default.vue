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
      <slot />
    </div>
  </template>
  
  <script setup>
  import { provide, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '../store'
  
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  
  provide('isLoggedIn', isLoggedIn)
  
  onMounted(() => {
    if (process.client) {
      isLoggedIn.value = !!localStorage.getItem('authToken')
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
  
  <style>
  
  </style>