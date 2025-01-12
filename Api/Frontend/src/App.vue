<script setup lang="ts">
import { ref, Ref } from 'vue';

const number:Ref<string> = ref("Hello, from city!");
</script>

<template>
  <cs>
    string number = "Hello, from City123!";
    Console.WriteLine(number);
  </cs>
  {{ number }}
</template>
