<script setup>
import { ref } from "vue";
import { Heart, Clock, MessageCircle } from "lucide-vue-next";
import ProfielCard from "@/components/ProfileCard.vue";
import { formatDate } from "@/lib/formatDate";

// Need Modify
const props = defineProps({
  author: Object,
  userID: String,
  post: Object,
});

const infoPost = ref([
  {
    info: "time",
    icon: Clock,
    value: formatDate(props.post.createdAt),
  },
  {
    info: "totalLikes",
    icon: Heart,
    value: "99k",
  },
  {
    info: "totalComments",
    icon: MessageCircle,
    value: 99,
  },
]);
</script>

<template>
  <div class="mb-3">
    <ProfielCard :author="author" :userID="userID" />
  </div>
  <div
    className="grid sm:grid-cols-3 border-b-2 sm:mb-10 sm:pb-10 border-gray-100"
  >
    <div className="col-span-2 flex-col ">
      <a
        :href="'/' + props.author.username + '/' + props.post.id"
        className="col-span-1 flex justify-center lg:justify-end items-center visible sm:hidden"
      >
        <img
          :src="props.post.image"
          alt=""
          className="w-full h-24 md:w-44 md:h-[6.5rem] object-center object-cover mb-5"
        />
      </a>
      <a :href="'/' + props.author.username + '/' + props.post.id">
        <span
          className="text-lg md:textxl lg:text-2xl text-black font-bold line-clamp-2"
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
          <div
            v-for="(info, index) in infoPost"
            :key="index"
            class="flex gap-1 items-center"
          >
            <template v-if="info.value !== 0">
              <component :is="info.icon" class="h-auto w-5" />
              {{ info.value }}
            </template>
          </div>
        </div>
        <!-- <BookmarkButton
          isBookmarked="{isBookmarked}"
          userId="{currentUser}"
          postId="{id}"
          custom="h-auto w-5 text-gray-500 hover:text-black"
        /> -->
      </div>
    </div>
    <a
      :href="'/' + props.author.username + '/' + props.post.id"
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
