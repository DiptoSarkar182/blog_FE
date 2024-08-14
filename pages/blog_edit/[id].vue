<template>
  <div class="blog-edit max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10" v-if="!loading && blog">
    <h2 class="text-2xl font-semibold text-gray-700 mb-6">Edit Blog Post</h2>
    <form @submit.prevent="updateBlog" class="space-y-4">
      <div>
        <label for="title" class="block text-gray-600 font-medium mb-2">Title:</label>
        <input 
          type="text" 
          v-model="blog.title" 
          required 
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="content" class="block text-gray-600 font-medium mb-2">Content:</label>
        <textarea 
          v-model="blog.content" 
          required 
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        ></textarea>
      </div>
      <div>
        <label for="blog_image" class="block text-gray-600 font-medium mb-2">Blog Image:</label>
        <input 
          type="file" 
          @change="onFileChange" 
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <nuxt-img 
          v-if="blog.blog_image_url" 
          :src="blog.blog_image_url" 
          alt="Blog Image" 
          class="mt-4 w-full h-64 object-cover rounded-lg shadow"
        />
      </div>
      <button 
        type="submit" 
        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Update Post
      </button>
    </form>
  </div>
  <div v-else-if="loading" class="text-center mt-10">
    <p class="text-gray-600">Loading...</p>
    <div class="spinner mt-6 flex justify-center">
      <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  </div>
  <div v-else class="text-center mt-10">
    <p class="text-gray-600">Blog not found.</p>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const blog = ref(null)
const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const selectedFile = ref(null)
const loading = ref(false)

const fetchBlog = async (id) => {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('You have to log in to edit the post')
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
    }
  } catch (error) {
    console.error('Failed to fetch blog:', error)
  } finally {
    loading.value = false
  }
}

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const updateBlog = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('You have to log in to edit the post')
      router.push('/login')
      return
    }

    const formData = new FormData()
    formData.append('blog[title]', blog.value.title)
    formData.append('blog[content]', blog.value.content)
    if (selectedFile.value) {
      formData.append('blog[blog_image]', selectedFile.value)
    }

    const response = await axios.put(`${API_BASE_URL}/blogs/${blog.value.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.status === 200 && response.data.status === 'success') {
      alert('Blog post updated successfully')
      router.push(`/blog_show/${blog.value.id}`)
    }
  } catch (error) {
    console.error('Failed to update blog:', error)
  } finally {
    loading.value = false
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
.blog-edit {
  max-width: 600px;
  margin: 0 auto;
}
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