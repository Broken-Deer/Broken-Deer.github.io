<template>
	<div class="footer">
		Copyright © Broken-Deer's Blog 2025-{{ year }}. All rights reserved.
		<br>
		Content lisenced under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"
			rel="noopener">CC BY-NC-SA 4.0</a> unless otherwise noted.
	</div>
</template>

<script setup lang="ts">
const year = (new Date()).getFullYear()
</script>

<style lang="less" scoped>
.footer {
	color: var(--palette-subtext0);
	font-size: 12px;
	text-align: center;
	margin-top: 40px;
}
</style>
