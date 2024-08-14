<template>
  <div class="blog-form max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
    <h2 class="text-2xl font-semibold text-gray-700 mb-6">Create a New Blog Post</h2>
    <form @submit.prevent="submitBlog" class="space-y-4">
      <div>
        <label for="title" class="block text-gray-600 font-medium mb-2">Title:</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          required 
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="content" class="block text-gray-600 font-medium mb-2">Content:</label>
        <textarea 
          id="content" 
          v-model="content" 
          required 
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        ></textarea>
      </div>
      <div>
        <label for="blog_image" class="block text-gray-600 font-medium mb-2">Image:</label>
        <input 
          type="file" 
          id="blog_image" 
          @change="handleFileUpload" 
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>
      <button 
        type="submit" 
        :disabled="loading" 
        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300"
      >
        Submit
      </button>
    </form>
    <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
    <ul v-if="errors.length" class="mt-4 text-red-500 space-y-1">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
    <div v-if="loading" class="spinner mt-6 flex justify-center">
      <!-- Optional: Spinner Icon for loading state -->
      <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const title = ref('')
const content = ref('')
const blogImage = ref(null)
const message = ref('')
const errors = ref([])
const loading = ref(false)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

const handleFileUpload = (event) => {
  blogImage.value = event.target.files[0]
}

const submitBlog = async () => {
  loading.value = true
  message.value = ''
  errors.value = []
  const token = localStorage.getItem('authToken')
  if (!token) {
    message.value = 'You must be logged in to submit a blog post.'
    loading.value = false
    return
  }

  const formData = new FormData()
  formData.append('blog[title]', title.value)
  formData.append('blog[content]', content.value)
  if (blogImage.value) {
    formData.append('blog[blog_image]', blogImage.value)
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/blogs`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    if (response.status === 201 && response.data.status === 'success') {
      message.value = response.data.message
      title.value = ''
      content.value = ''
      blogImage.value = null
      errors.value = []
      alert('Blog post submitted successfully!')
      router.push('/')
    }
  } catch (error) {
    console.error('Failed to submit blog:', error)
    if (error.response && error.response.data && error.response.data.errors) {
      errors.value = error.response.data.errors
    } else {
      message.value = 'Failed to submit blog. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.blog-form {
  max-width: 600px;
  margin: 0 auto;
}
.blog-form div {
  margin-bottom: 1em;
}
.blog-form label {
  display: block;
  margin-bottom: 0.5em;
}
.blog-form input,
.blog-form textarea {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}
.blog-form button {
  padding: 0.5em 1em;
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