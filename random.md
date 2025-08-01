---
title: Go to random page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from './.vitepress/theme/components/posts.data'

const router = useRouter()

onMounted(() => {
  if (!posts || posts.length === 0) return
  const random = posts[Math.floor(Math.random() * posts.length)]
  if (random.url) {
    router.go(random.url)
  }
})

</script>
