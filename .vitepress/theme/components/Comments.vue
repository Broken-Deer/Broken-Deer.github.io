<script setup lang="ts">
import { useData } from "vitepress";
import { ref } from "vue";

const { title } = useData();

const theme = ref<"catppuccin_mocha" | "catppuccin_latte">("catppuccin_mocha");
const key = ref(0);
const updateGiscusTheme = () => {
  const iframe = document.querySelector("iframe.giscus-frame") as HTMLIFrameElement;
  iframe.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: theme.value,
        },
      },
    },
    "https://giscus.app",
  );
};
const syncTheme = () => {
  const html = document.documentElement;
  theme.value = html.classList.contains("dark") ? "catppuccin_mocha" : "catppuccin_latte";
  updateGiscusTheme();
};

const observer = new MutationObserver(syncTheme);

// Start observing the target node for configured mutations
observer.observe(document.documentElement, { attributes: true });
syncTheme();
</script>

<template>
  <div :key="title" class="giscus">
    <component
      :is="'script'"
      :key="key"
      src="https://giscus.app/client.js"
      data-repo="Broken-Deer/Broken-Deer.github.io"
      data-repo-id="R_kgDOOjed4A"
      data-category="Announcements"
      data-category-id="DIC_kwDOOjed4M4Ctl9E"
      data-mapping="pathname"
      data-strict="1"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      :data-theme="theme"
      data-lang="zh-CN"
      crossorigin="anonymous"
      async />
  </div>
</template>
