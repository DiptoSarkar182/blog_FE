<template>
  <div class="blog-form">
    <h2>Create a New Blog Post</h2>
    <form @submit.prevent="submitBlog">
      <div>
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div>
        <label for="content">Content:</label>
        <textarea id="content" v-model="content" required></textarea>
      </div>
      <div>
        <label for="blog_image">Image:</label>
        <input type="file" id="blog_image" @change="handleFileUpload" />
      </div>
      <button type="submit" :disabled="loading">Submit</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <ul v-if="errors.length">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
    <div v-if="loading" class="spinner"></div>
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