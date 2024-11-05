<script setup>
import { Heart } from "lucide-vue-next";
import { likePost, unlikePost, isLiked } from "@/api/post/post.js";
import { ref, onMounted } from "vue";

const props = defineProps({
  like: Number,
  postId: String,
});

const likeCount = ref(props.like);
const userLiked = ref(false);

onMounted(async () => {
  try {
    userLiked.value = await isLiked({ postId: props.postId });
  } catch (error) {
    console.error(error);
  }
});

const likeHandler = async () => {
  try {
    if (userLiked.value) {
      await unlikePost(props.postId);
      likeCount.value--;
    } else {
      await likePost({ postId: props.postId });
      likeCount.value++;
    }
    userLiked.value = !userLiked.value;
  } catch (error) {
    console.error(error.message);
  }
};
</script>

<template>
  <div class="flex flex-row items-center gap-2">
    <button @click="likeHandler">
      <Heart :class="userLiked ? 'fill-red-500 w-6 h-6' : ' w-6 h-6'" />
    </button>
    <span class="text-gray-500">{{ likeCount }}</span>
  </div>
</template>

<style scoped>
button .text-red-500,
button .text-gray-400 {
  transition: color 0.3s ease;
}
</style>
