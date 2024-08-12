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
        <button type="submit">Submit</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const title = ref('')
  const content = ref('')
  const message = ref('')
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const router = useRouter()
  
  const submitBlog = async () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      message.value = 'You must be logged in to submit a blog post.'
      return
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/blogs`,
        { blog: { title: title.value, content: content.value } },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status === 201 && response.data.status === 'success') {
        message.value = response.data.message
        title.value = ''
        content.value = ''
        alert('Blog post submitted successfully!')
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to submit blog:', error)
      message.value = 'Failed to submit blog. Please try again.'
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