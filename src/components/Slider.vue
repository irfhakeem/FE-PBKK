<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:activeCategory"]);

const updateCategory = (category) => {
  emit("update:activeCategory", category);
};
</script>

<template>
  <div class="sticky top-0 bg-white">
    <div class="relative mb-10 py-4 border-b-[2px] border-gray-100">
      <a
        v-for="category in categories"
        :key="category"
        :class="[
          'mr-10 pb-4 text-sm hover:text-black cursor-pointer',
          activeCategory === category
            ? 'border-b-2 border-black text-black'
            : 'text-gray-500',
        ]"
        @click="updateCategory(category)"
        style="white-space: nowrap"
      >
        {{ category }}
      </a>
    </div>
  </div>
</template>
