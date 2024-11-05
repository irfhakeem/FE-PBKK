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
  <div class="flex flex-row items-center">
    <button class="w-10 h-10" @click="likeHandler">
      <Heart :class="userLiked ? 'text-red-500' : 'text-gray-400'" />
    </button>
    <span>{{ likeCount }}</span>
  </div>
</template>

<style scoped>
button .text-red-500,
button .text-gray-400 {
  transition: color 0.3s ease;
}
</style>
