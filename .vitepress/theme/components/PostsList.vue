<template>
  <ul class="posts-list">
    <li v-for="post of posts">
      <a :href="post.url" class="posts-list-entry">
        <p class="title">{{ post.frontmatter.title }}</p>
        <ClientOnly>
          <PostedDate :date="post.frontmatter.date" />
        </ClientOnly>
        <div class="excerpt" v-html="post.frontmatter.description" style="margin-top: 12px"></div>
      </a>
      <div class="tags" style="margin-top: 12px">
        <a class="tag" v-for="tag in post.frontmatter.tags" :href="`/archives/?tag=` + tag"
          ># {{ tag }}</a
        >
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { data as posts } from "./posts.data";
import PostedDate from "./PostedDate.vue";
const props = defineProps<{
  filterTags?: string[];
}>();

const filteredPosts = computed(() => {
  return posts.filter((x) => {
    if (!props.filterTags) return true;
    return props.filterTags.filter((y) => x.frontmatter.tags.includes(y));
  });
});
</script>

<style lang="less" scoped>
ul.posts-list {
  li {
    list-style: none;
    a {
      text-decoration: none;
      cursor: default;
      p.title {
        color: var(--palette-text);
        font-size: 1.3rem;
      }
      .excerpt {
        color: var(--palette-subtext0);
      }
    }
    a,
    a * {
      transition: all 500ms ease;
    }
    a:hover,
    a:hover * {
      color: var(--palette-mauve) !important;
    }
    a.tag {
      display: inline-flex;
      margin-right: 8px;
      padding: 4px 10px;
      background-color: rgba(var(--palette-mauve-rgb), 0.1);
      border-radius: 6px;
      color: rgb(var(--palette-mauve-rgb));
    }
  }
}
html.dark ul.post-list {
  li {
    a {
      p.title {
        color: var(--palette-lavender);
      }
      .excerpt {
        color: rgba(var(--palette-lavender-rgb), 0.7);
      }
    }
    a:hover,
    a:hover * {
      color: var(--palette-mauve) !important;
    }
    a.tag {
      background-color: rgba(var(--palette-mauve-rgb), 0.1);
      color: rgb(var(--palette-mauve-rgb));
    }
  }
}
</style>
