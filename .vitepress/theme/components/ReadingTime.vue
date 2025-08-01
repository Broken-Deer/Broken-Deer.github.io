<template>
  <div>
    <div class="reading-time">
      <FontAwesomeIcon icon="fas fa-stopwatch" style="margin-right: 4px" />预计用时: {{ time }} 分钟
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
library.add(faStopwatch);

defineProps<{
  time: number;
}>();
</script>
<style lang="less" scoped></style>
