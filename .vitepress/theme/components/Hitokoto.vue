<template>
  <div
    ref="hitokoto"
    style="text-align: center; font-style: italic; color: #b4befe; margin-top: 1rem"></div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";

const hitokoto_element = useTemplateRef("hitokoto");
onMounted(async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  const data = await res.json();
  if (!hitokoto_element.value) throw "Internal error";
  hitokoto_element.value.textContent = data.hitokoto;
});
</script>
