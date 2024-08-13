<template>
  <div class="blog-edit" v-if="blog">
    <h2>Edit Blog Post</h2>
    <form @submit.prevent="updateBlog">
      <div>
        <label for="title">Title:</label>
        <input type="text" v-model="blog.title" required />
      </div>
      <div>
        <label for="content">Content:</label>
        <textarea v-model="blog.content" required></textarea>
      </div>
      <div>
        <label for="blog_image">Blog Image:</label>
        <input type="file" @change="onFileChange" />
        <nuxt-img v-if="blog.blog_image_url" :src="blog.blog_image_url" alt="Blog Image" />
      </div>
      <button type="submit">Update Post</button>
    </form>
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
const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const selectedFile = ref(null)

const fetchBlog = async (id) => {
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
  }
}

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const updateBlog = async () => {
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
</style>