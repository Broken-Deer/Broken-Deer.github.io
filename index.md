---
layout: home
title: BrokenDeer 的垃圾堆
---

<!-- <div style="text-align: center; margin-top: 2rem; width: 100%"> -->
<!--   <img src="/avatar.png" alt="avatar" style="border-radius: 50%; width: 40px; height: 40px;" /> -->
<!-- </div> -->

<img src="/catppuccin-cat-footer.png" alt="avatar"  />

<div id="hitokoto" style="text-align: center; font-style: italic; color: #b4befe; margin-top: 1rem;"></div>
<!-- <div id="hitokoto_from" style="font-size:0.9em;text-align: right; font-style: italic; color: #b4befe; margin-bottom: 1rem;"></div> -->
<div id="hitokoto" style="text-align: center; margin-top: 1rem;">
━━━━━━ ❖ ━━━━━━
</div>

<script lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  const res = await fetch('https://v1.hitokoto.cn')
  const data = await res.json()
  document.getElementById('hitokoto').textContent = data.hitokoto
  // document.getElementById('hitokoto_from').textContent = "——" + data.from
})
</script>

<script setup lang="ts">
import { data as posts } from './data/posts.data.mts'

function formatDate(raw: string): string {
  const date = new Date(raw)
  date.setUTCHours(12)
  return date.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<ul class="posts-list">
  <li v-for="post of posts">
    <a :href="post.url" class="posts-list-entry">
    <p class="title">{{ post.frontmatter.title }}</p>
    <FontAwesomeIcon icon="fas fa-calendar" /> {{ formatDate(post.frontmatter.date) }}
    <div class="excerpt" v-html="post.frontmatter.description" style="margin-top: 12px"></div>
    </a>
    <div class="tags" style="margin-top: 12px;">
      <a class="tag" v-for="tag in post.frontmatter.tags" :href="`/archives/?tag=` + tag"># {{ tag }}</a>
    </div>
  </li>
</ul>
