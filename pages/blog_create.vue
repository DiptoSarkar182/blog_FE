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
      <button type="submit">Submit</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <ul v-if="errors.length">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

const handleFileUpload = (event) => {
  blogImage.value = event.target.files[0]
}

const submitBlog = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    message.value = 'You must be logged in to submit a blog post.'
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
</style>