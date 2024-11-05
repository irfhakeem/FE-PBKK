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

const router = useRouter();
const props = defineProps({
  authorUsername: String,
  list: Object,
});

const author = ref({});

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
</script>

<template>
  <Card class="w-full cursor-pointer mb-5">
    <div class="flex">
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
                  >Copy link</DropdownMenuItem
                >
                <!-- <div v-if=""></div> -->
                <DropdownMenuItem class="sm:text-sm text-xs"
                  >Edit list info</DropdownMenuItem
                >
                <DropdownMenuItem class="sm:text-sm text-xs"
                  >Remove items</DropdownMenuItem
                >
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </div>
      <div class="flex-[0.25] bg-red-100">
        <!-- fill with story banner klo ada-->
      </div>
      <div class="flex-[0.15] bg-green-100 ml-1">
        <!-- fill with story banner klo ada-->
      </div>
      <div class="flex-[0.06] bg-blue-100 ml-1">
        <!-- fill with story banner klo ada-->
      </div>
    </div>
  </Card>
</template>
