<script setup>
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userByUsername } from "@/api/user/user.js";
import { ref, onMounted, watch } from "vue";
import { Ellipsis } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { deleteList } from "@/api/user/list.js";

const router = useRouter();
const props = defineProps({
  authorUsername: String,
  list: Object,
});

const author = ref({});
const list = ref(props.list);

console.log(list.value);

const fetchAuthor = async () => {
  if (props.authorUsername) {
    author.value = await userByUsername(props.authorUsername);
  }
};

onMounted(fetchAuthor);
watch(() => props.authorUsername, fetchAuthor);

const navigateToLink = () => {
  router.push({
    path: `/profile/${author.value.username}/lists/${props.list.id}`,
  });
};

const deleteListHandler = async () => {
  await deleteList(list.value.id);
  router.go(0);
};

const handleCopyLink = () => {
  navigator.clipboard.writeText(
    `http://localhost:5173/profile/${author.value.username}/lists/${props.list.id}`
  );
};
</script>

<!-- Delete List -->
<template>
  <Card class="w-full cursor-pointer mb-5">
    <div class="flex flex-row justify-between">
      <!-- sections -->
      <div class="flex-[0.55] bg-gray-100">
        <CardHeader @click="navigateToLink">
          <CardDescription class="flex items-center gap-2">
            <!-- User Avatar -->
            <img
              :src="author.avatar"
              alt="User avatar"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <!-- Username -->
            <span class="text-[11px] sm:text-sm font-semibold text-gray-800">{{
              author.name
            }}</span>
          </CardDescription>

          <!-- Card Title -->
          <CardTitle class="font-bold text-base sm:text-xl">{{
            props.list.title
          }}</CardTitle>
        </CardHeader>
        <CardFooter class="flex justify-between px-6 pb-6">
          <p class="text-sm text-gray-600">
            {{ props.list.posts.length }} Posts
          </p>

          <!-- Options Dropdown -->
          <div class="relative">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button><Ellipsis aria-hidden="true"></Ellipsis></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="md:w-40 sm:w-48 w-40">
                <DropdownMenuItem class="sm:text-sm text-xs"
                  ><button @click="handleCopyLink">
                    Copy link
                  </button></DropdownMenuItem
                >
                <!-- <div v-if=""></div> -->
                <DropdownMenuItem class="sm:text-sm text-xs"
                  >Edit list info</DropdownMenuItem
                >
                <DropdownMenuItem class="sm:text-sm text-xs"
                  ><button @click="deleteListHandler">
                    Remove items
                  </button></DropdownMenuItem
                >
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </div>

      <div class="flex-[0.45] flex gap-1">
        <div
          v-if="list.posts.length === 0"
          v-for="i in 3"
          :key="i"
          :class="{
            'flex-[0.5]': i === 1,
            'flex-[0.3]': i === 2,
            'flex-[0.2]': i === 3,
          }"
        >
          <div class="flex-1 bg-gray-200 h-full"></div>
        </div>
        <div
          v-else
          v-for="(post, index) in list.posts.slice(0, 3)"
          :key="post.id"
          :class="{
            'flex-[0.5]': index === 0,
            'flex-[0.3]': index === 1,
            'flex-[0.2]': index === 2,
          }"
        >
          <img
            :src="post.image"
            alt="Post image"
            class="h-full w-auto object-cover"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
