<template>
  <div class="home p-4 bg-gray-100 min-h-screen">
    <header class="mb-6">
      <h1 v-if="isLoggedIn" class="text-3xl font-bold text-gray-800">Welcome, {{ user?.name }}</h1>
    </header>
    <div class="mb-6">
      <button 
        @click="navigateToBlogCreate"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        New Post
      </button>
    </div>
    <div v-if="!isLoggedIn || blogs.length > 0">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Latest Blogs</h2>
      <ul class="space-y-4">
        <li 
          v-for="blog in blogs" 
          :key="blog.id" 
          class="bg-white shadow rounded-lg p-6"
        >
          <nuxt-link :to="`/blog_show/${blog.id}`">
            <h3 class="text-xl font-bold text-blue-600 hover:underline">
              {{ blog.title }}
            </h3>
          </nuxt-link>
          <p class="text-gray-600"><strong>Author:</strong> {{ blog.name }}</p>
          <p class="text-gray-600"><strong>Posted on:</strong> {{ new Date(blog.created_at).toLocaleString() }}</p>
          <nuxt-img 
            v-if="blog.blog_image_url" 
            :src="blog.blog_image_url" 
            alt="Blog Image" 
            class="mt-4 rounded-lg shadow w-64 h-40 object-cover"
          />
        </li>
      </ul>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '../store'

const user = ref(null)
const blogs = ref([])
const { isLoggedIn } = useAuth()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

onMounted(() => {
  const token = localStorage.getItem('authToken')
  if (token) {
    fetchUserDetails(token)
  } else {
    fetchBlogs()
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
      fetchBlogs() // Fetch blogs after setting user details
    }
  } catch (error) {
    console.error('Failed to fetch user details:', error)
    handleLogout()
  }
}

const fetchBlogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blogs`)
    if (response.status === 200 && response.data.status === 'success') {
      blogs.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
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

const navigateToBlogCreate = () => {
  if (isLoggedIn.value) {
    router.push('/blog_create')
  } else {
    alert('You need to sign in')
    router.push('/login')
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}
.home header {
  text-align: center;
  margin-bottom: 2em;
}
.home ul {
  list-style: none;
  padding: 0;
}
.home li {
  margin-bottom: 2em;
}
.home img {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 1em;
}
</style>