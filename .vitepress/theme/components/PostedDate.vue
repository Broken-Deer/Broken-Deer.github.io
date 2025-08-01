<template>
  <div><FontAwesomeIcon icon="fas fa-calendar" /> {{ formatDate(date) }}</div>
</template>

<script setup lang="ts">
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
