<template>
  <div class="posted-date"><FontAwesomeIcon icon="fas fa-calendar" /> {{ formatDate(date) }}</div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
library.add(faCalendar);

defineProps<{
  date: string;
}>();
const formatDate = (raw: string): string => {
  const date = new Date(raw);
  date.setUTCHours(12);
  return date.toLocaleDateString(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style lang="less" scoped></style>
