// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 5173
  },
  plugins: [
    '~/plugins/toast.js'
  ],
  modules: ['@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],
  image: {
    // Options
  },
})