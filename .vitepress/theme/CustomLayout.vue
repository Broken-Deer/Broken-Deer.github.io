<script setup>
import DefaultTheme from "vitepress/theme";
import Comments from "./components/Comments.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-after>
      My custom sidebar top content
      <Comments />
    </template>
  </Layout>
</template>
