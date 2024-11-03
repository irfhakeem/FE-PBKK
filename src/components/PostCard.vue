<script setup>
import { ref } from "vue";
import { Heart, Clock, MessageCircle } from "lucide-vue-next";
import ProfielCard from "@/components/ProfileCard.vue";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    // value: formatDate(props.post.createdAt),
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

const isShowButtons = ref(false);

const showButtons = () => {
  isShowButtons.value = true; // Set isShowButtons to true
};

const hideButtons = () => {
  isShowButtons.value = false; // Set isShowButtons to false
};

const cancel = () => {
  console.log('Cancel clicked');
  hideButtons(); // Hide buttons after canceling
};

const done = () => {
  console.log('Done clicked');
  hideButtons(); // Hide buttons after done
};
</script>

<template>
  
  <div class="my-6 flex  items-center gap-1.5">
    <div class="border-l-4 h-10 border-black mr-3"></div>
    <Input
      class="bg-gray-100"
      id="desc"
      type="text"
      placeholder="Write a brief description"
      @focus="showButtons"  
      @blur="hideButtons"  
    />
    <div v-if="isShowButtons" class="flex gap-2">
      <Button variant="ghost" @click="cancel">Cancel</Button>
      <Button variant="ghost" @click="done">Done</Button>
    </div>
  </div>

  <div class="my-6">
    <ProfielCard :author="author" :userID="userID" />
  </div>
  <div
    className="grid sm:grid-cols-3 border-b-2 sm:mb-10 sm:pb-10 border-gray-100"
  >
    <div className="col-span-2 flex-col ">

      <a
        :href="props.author && props.post ? '/' + props.author.username + '/' + props.post.id : '#'"
        class="col-span-1 flex justify-center lg:justify-end items-center visible sm:hidden"
      >
        <img
          :src="props.post && props.post.image ? props.post.image : 'https://via.placeholder.com/150'"
          alt="Post Image"
          class="w-full h-24 md:w-44 md:h-[6.5rem] object-center object-cover mb-5"
        />
      </a>
      <a :href="props.author && props.post ? '/' + props.author.username + '/' + props.post.id : '#'">
        <span
          class="text-lg md:text-xl lg:text-2xl text-black font-bold line-clamp-2"
        >
          {{ props.post && props.post.title ? props.post.title : "Default Title" }}
        </span>
        <span
          class="text-gray-500 text-xs md:text-sm font-medium mt-2 mb-5 line-clamp-2"
        >
          {{ props.post && props.post.caption ? props.post.caption : "Default caption text for testing the component layout." }}
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
        alt="Post Image"
        className=" w-40 h-24 md:w-44 md:h-[6.5rem] object-center object-cover"
      />
    </a>
  </div>
</template>
