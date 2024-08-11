import { ref } from 'vue'

const isLoggedIn = ref(false)

export function useAuth() {
  return {
    isLoggedIn
  }
}