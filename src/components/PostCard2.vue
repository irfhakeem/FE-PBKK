<script setup>
import { ref, onMounted, watch } from "vue";
import { Heart, MessageCircle } from "lucide-vue-next";
import ProfielCard from "@/components/ProfileCard.vue";
import { formatDate } from "@/lib/formatDate";
import { userByUsername } from "@/api/user/user.js";
import BookmarkButton from "./BookmarkButton.vue";

const props = defineProps({
  author: Object,
  authorUsername: String,
  post: Object,
});

const author = ref(props.author || {});

const fetchAuthor = async () => {
  if (props.authorUsername) {
    author.value = await userByUsername(props.authorUsername);
  }
};

onMounted(fetchAuthor);
watch(() => props.authorUsername, fetchAuthor);
</script>

<template>
  <!-- Image -->
  <a
    :href="'/' + author.username + '/' + props.post.id"
    className="flex justify-center items-center w-full"
  >
    <img
      :src="props.post.image"
      alt=""
      className="w-full max-h-72 min-h-48 object-center object-cover mb-5"
    />
  </a>

  <!-- Profile Card -->
  <div class="mb-3 pt-2">
    <ProfielCard :author="author" />
  </div>

  <!-- Post Content -->
  <div className="col-span-2 flex-col mb-4">
    <a :href="'/' + author.username + '/' + props.post.id">
      <span className="text-lg text-black font-bold line-clamp-2">
        {{ props.post.title }}
      </span>
      <span
        className="text-gray-500 text-xs md:text-sm font-medium mt-2 mb-5 line-clamp-2"
      >
        {{ props.post.caption }}
      </span>
    </a>
    <div
      className="flex justify-between text-gray-500 text-xs font-medium items-center"
    >
      <div className="flex gap-5 items-center justify-center">
        <div class="flex flex-row gap-2 items-center">
          <span class="">{{ formatDate(props.post.createdAt) }}</span>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <Heart class="w-4 h-4 fill-gray-500" />
          <span>{{ props.post.likeCount }}</span>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <MessageCircle class="w-4 h-4 fill-gray-500" />
          <span>{{ props.post.commentCount }}</span>
        </div>
      </div>
      <BookmarkButton :postId="props.post.id" />
    </div>
  </div>
</template>
