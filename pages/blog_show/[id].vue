<template>
  <div class="blog-show" v-if="blog">
    <h2>{{ blog.title }}</h2>
    <p><strong>Author:</strong> {{ blog.name }}</p>
    <p><strong>Posted on:</strong> {{ new Date(blog.created_at).toLocaleString() }}</p>
    <nuxt-img v-if="blog.blog_image_url" :src="blog.blog_image_url" alt="Blog Image" />
    <p>{{ blog.content }}</p>
    <div v-if="isOwner">
      <router-link :to="`/blog_edit/${blog.id}`">
        <button>Edit Post</button>
      </router-link>
      <button @click="confirmDelete">Delete Post</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const blog = ref(null)
const isOwner = ref(false)
const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchBlog = async (id) => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('You have to log in to see the post')
      router.push('/login')
      return
    }
    const response = await axios.get(`${API_BASE_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 200 && response.data.status === 'success') {
      blog.value = response.data.data
      checkOwnership()
    }
  } catch (error) {
    console.error('Failed to fetch blog:', error)
  }
}

const checkOwnership = () => {
  const currentUserId = localStorage.getItem('userId') // Assuming userId is stored in localStorage after login
  console.log('Blog User ID:', blog.value.user_id)
  console.log('Current User ID:', currentUserId)
  if (blog.value.user_id == currentUserId) {
    isOwner.value = true
  }
}

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this post?')) {
    deleteBlog()
  }
}

const deleteBlog = async () => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('You have to log in to delete the post')
      router.push('/login')
      return
    }
    const response = await axios.delete(`${API_BASE_URL}/blogs/${blog.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 200 && response.data.status === 'success') {
      alert('Blog post deleted successfully')
      router.push('/')
    }
  } catch (error) {
    console.error('Failed to delete blog:', error)
  }
}

onMounted(() => {
  const blogId = route.params.id
  if (blogId) {
    fetchBlog(blogId)
  }
})
</script>

<style scoped>
.blog-show {
  max-width: 600px;
  margin: 0 auto;
}
.blog-show img {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 1em;
}
</style>