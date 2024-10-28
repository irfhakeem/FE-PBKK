<script setup>
import { defineProps, ref } from "vue";
import { Heart, Clock } from "lucide-vue-next";
import ProfielCard from "@/components/ProfileCard.vue";

// Need Modify
const props = defineProps({
  author: Object,
  userID: String,
});

const createdAt = new Date();
const totalLikes = 10;
const totalComments = 5;

const infoPost = ref([
  {
    info: "time",
    icon: Clock,
    value: createdAt.toString(),
  },
  {
    info: "totalLikes",
    icon: Heart,
    value: totalLikes,
  },
  //   {
  //     info: "totalComments",
  //     icon: Message-Circle,
  //     value: totalComments,
  //   },
]);
</script>

<template>
  <ProfielCard :author="author" :userID="userID" />
  <div className="grid grid-cols-3 border-b-2 border-gray-100">
    <div className="col-span-2 flex-col mb-10 pr-5 md:pr-0">
      <a href="">
        <span
          className="text-lg md:textxl lg:text-2xl text-black font-bold line-clamp-2"
        >
          Judul
        </span>
        <span
          className="text-gray-500 text-xs md:text-sm font-medium mt-3 mb-5 line-clamp-2"
        >
          Caption
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
      href=""
      className="col-span-1 flex justify-center lg:justify-end items-center"
    >
      <img
        src=""
        alt=""
        className="w-40 h-24 md:w-44 md:h-[6.5rem] object-center object-cover"
      />
    </a>
  </div>
</template>
