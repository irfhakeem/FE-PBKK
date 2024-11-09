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
  <div class="mb-3 pt-5">
    <ProfielCard :author="author" />
  </div>
  <div className="grid sm:grid-cols-3 border-b-2 pb-5 sm:pb-10 border-gray-100">
    <div className="col-span-2 flex-col ">
      <a
        :href="'/' + author.username + '/' + props.post.id"
        className="col-span-1 flex justify-center lg:justify-end items-center visible sm:hidden"
      >
        <img
          :src="props.post.image"
          alt=""
          className="w-full h-24 md:w-44 md:h-[6.5rem] object-center object-cover mb-5"
        />
      </a>
      <a :href="'/' + author.username + '/' + props.post.id">
        <span
          className="text-lg md:text-xl lg:text-2xl text-black font-bold line-clamp-2"
        >
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
          <!-- <LikeButton :like="props.post.likeCount" :postId="props.post.id" /> -->
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
    <a
      :href="'/' + author.username + '/' + props.post.id"
      className="hidden sm:visible sm:col-span-1 sm:flex justify-center lg:justify-end items-center"
    >
      <img
        :src="props.post.image"
        alt=""
        className=" w-40 h-24 md:w-44 md:h-[6.5rem] object-center object-cover"
      />
    </a>
  </div>
</template>
