<script setup>
import DefaultBar from './DefaultBar.vue'
</script>

<template>
  <v-app>
    <default-bar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
