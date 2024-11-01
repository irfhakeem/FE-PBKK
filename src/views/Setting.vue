<script setup>
import Navbar from "@/components/Navbar.vue";
import {
  me,
  deactivateAccount,
  deleteAccount,
  updateUser,
} from "@/api/user/user.js";
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoveUpRight } from "lucide-vue-next";
import { logoutUser } from "@/api/auth/auth.js";
import { useRouter } from "vue-router";
import { uploadAvatar } from "@/api/storage/storage.js";

const user = ref({
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});
var usernameLength = ref();
var bioLength = ref();
var avatarData = ref({});
const router = useRouter();

onMounted(async () => {
  user.value = await me();
  usernameLength.value = user.value.username.length;
  if (user.value.bio == null) {
    bioLength.value = 0;
  } else bioLength.value = user.value.bio.length;
});

const length = (value) => {
  return value.length;
};

const DeleteAccount = async () => {
  await deleteAccount();
  await logoutUser();
  router.push("/");
};

const DeactivateAccount = async () => {
  await deactivateAccount();
  await logoutUser();
  router.push("/");
};

const UpdateUsername = async () => {
  const username = document.getElementById("username").value;
  await updateUser({ username: username });
  router.go(0);
};

const UpdateEmail = async () => {
  const email = document.getElementById("email").value;
  await updateUser({ email: email });
  router.go(0);
};

const UpdateProfile = async () => {
  const bio = document.getElementById("bio").value;
  const name = document.getElementById("name").value;
  await updateUser({ bio: bio, name: name, avatar: user.value.avatar });
  router.go(0);
};

const UploadAvatar = async () => {
  const avatarFile = document.getElementById("avatarFile").files[0];
  if (!avatarFile) {
    console.error("No file selected");
    return;
  }
  try {
    avatarData = await uploadAvatar(avatarFile);
    user.value.avatar = avatarData.file;
  } catch (error) {
    console.error("Failed to upload avatar:", error.message);
  }
};

const RemoveAvatar = async () => {
  user.value.avatar = "/public/default_avatar.svg";
};
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />
  <div class="flex flex-col lg:max-w-6xl lg:mx-auto py-10 px-6 md:px-8 gap-6">
    <p class="text-2xl md:text-4xl font-semibold">Settings</p>
    <div class="flex flex-col pt-6 gap-8 border-t-2 border-gray-100 w-full">
      <div class="grid grid-cols-2">
        <p class="text-sm font-medium justify-start">Email Address</p>
        <div class="col-span-1 flex justify-end">
          <Dialog class="cursor-pointer">
            <DialogTrigger as-child>
              <button
                class="cursor-pointer line-clamp-1 max-w-xs text-gray-500 hover:text-black font-light text-sm"
              >
                {{ user.email }}
              </button>
            </DialogTrigger>
            <DialogContent
              class="rounded-md max-w-[375px] sm:max-w-[425px] pt-8"
            >
              <DialogHeader class="flex items-center">
                <DialogTitle>Email Address</DialogTitle>
              </DialogHeader>
              <div class="flex flex-col gap-2 items-start">
                <input
                  id="email"
                  v-model="user.email"
                  class="bg-gray-100 border-none w-full px-4 py-2 text-sm"
                />
                <p class="text-xs text-gray-500">
                  You can log in into the Portal with this email address
                </p>
              </div>
              <DialogFooter>
                <button
                  type="submit"
                  class="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm"
                  @click="UpdateEmail"
                >
                  Save
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <p class="text-sm font-medium justify-start">Username</p>
        <div class="col-span-1 flex justify-end">
          <Dialog class="cursor-pointer">
            <DialogTrigger as-child>
              <button
                class="cursor-pointer line-clamp-1 max-w-xs text-gray-500 hover:text-black font-light text-sm"
              >
                {{ user.username }}
              </button>
            </DialogTrigger>
            <DialogContent
              class="rounded-md max-w-[375px] sm:max-w-[425px] pt-8"
            >
              <DialogHeader class="flex items-center">
                <DialogTitle>Username</DialogTitle>
              </DialogHeader>
              <div class="flex flex-col gap-2 items-start">
                <input
                  id="username"
                  v-model="user.username"
                  class="bg-gray-100 border-none w-full px-4 py-2 text-sm"
                  :maxlength="30"
                  @input="usernameLength = length(user.username)"
                />
                <div class="flex justify-between items-center w-full">
                  <p class="text-xs text-gray-500">
                    profile/{{ user.username }}
                  </p>
                  <p class="text-xs text-gray-500">{{ usernameLength }}/30</p>
                </div>
              </div>

              <DialogFooter>
                <button
                  type="submit"
                  class="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm"
                  @click="UpdateUsername"
                >
                  Save
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <span class="text-sm font-medium justify-start"
            >Profile Information</span
          ><span class="text-[11px] text-justify text-gray-500">
            Edit your avatar, name, and bio here.
          </span>
        </div>
        <div class="col-span-1 flex justify-end">
          <Dialog class="cursor-pointer">
            <DialogTrigger as-child>
              <button
                class="cursor-pointer line-clamp-1 max-w-xs text-gray-500 hover:text-black font-light text-sm"
              >
                {{ user.name }}
              </button>
            </DialogTrigger>
            <DialogContent
              class="rounded-md max-w-[375px] sm:max-w-[425px] pt-8"
            >
              <DialogHeader class="flex items-center">
                <DialogTitle>Profile Information</DialogTitle>
              </DialogHeader>

              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-3">
                  <label for="name" class="text-xs sm:text-sm"> Avatar </label>
                  <div class="flex gap-5">
                    <img
                      :src="user.avatar"
                      alt=""
                      class="w-16 h-16 sm:w-20 sm:h-[76px] rounded-full object-cover bg-center bg-cover"
                      style="flex: 20%"
                    />
                    <div class="flex flex-col gap-4" style="flex: 80%">
                      <div class="flex gap-4">
                        <label
                          class="cursor-pointer text-xs sm:text-sm font-medium text-emerald-700"
                        >
                          Upload
                          <input
                            id="avatarFile"
                            type="file"
                            class="hidden"
                            @change="UploadAvatar"
                          />
                        </label>
                        <button
                          class="cursor-pointer text-xs sm:text-sm font-medium text-red-700 disabled:opacity-50"
                          @click="RemoveAvatar"
                          :disabled="
                            user.avatar === '/public/default_avatar.svg'
                          "
                        >
                          Remove
                        </button>
                      </div>
                      <p class="text-xs sm:text-[13px]">
                        Recommended size: 150x150 pixels. JPG or PNG.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label for="name" class="text-xs sm:text-sm"> Name* </label>
                  <input
                    id="name"
                    :value="user.name"
                    class="bg-gray-100 border-none w-full px-4 py-2 text-sm font-medium"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="name" class="text-xs sm:text-sm">
                    Short Bio
                  </label>
                  <textarea
                    id="bio"
                    v-model="user.bio"
                    :maxlength="200"
                    class="min-h-24 bg-gray-100 border-none w-full px-4 py-2 text-[13px] font-semibold resize-none"
                    @input="
                      bioLength = length(user.bio);
                      $event.target.style.height = 'auto';
                      $event.target.style.height =
                        $event.target.scrollHeight + 'px';
                    "
                  ></textarea>
                  <div class="flex justify-end w-full">
                    <p class="text-xs text-gray-500">{{ bioLength }}/200</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <button
                  type="submit"
                  @click="UpdateProfile"
                  class="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm"
                >
                  Save
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

    <div class="flex flex-col pt-6 gap-8 border-t-2 border-gray-100 w-ful">
      <div class="grid grid-cols-2">
        <p class="text-sm font-medium justify-start">Change Password</p>
        <button class="col-span-1 flex justify-end">
          <MoveUpRight class="w-5 h-5 text-gray-500 hover:text-black" />
        </button>
      </div>
      <div class="grid grid-cols-2">
        <p class="text-sm font-medium justify-start">Change Pin Number</p>
        <button class="col-span-1 flex justify-end">
          <MoveUpRight class="w-5 h-5 text-gray-500 hover:text-black" />
        </button>
      </div>
    </div>
    <div class="flex flex-col pt-6 gap-8 border-t-2 border-gray-100 w-ful">
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <button class="flex flex-col gap-2" @click="DeactivateAccount">
            <span class="text-sm font-medium text-red-700"
              >Deactivate Account</span
            >
            <span class="text-[11px] text-justify text-gray-500">
              Deactivating your account will suspend your account until you log
              in.
            </span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent
          class="rounded-md max-w-[375px] sm:max-w-[425px] pt-8"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will suspend your account until you log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="DeactivateAccount"
              >Yes</AlertDialogAction
            >
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger as-child>
          <button class="flex flex-col gap-2">
            <span class="text-sm font-medium text-red-700">Delete Account</span>
            <span class="text-[11px] text-justify text-gray-500">
              Permanentaly delete your account and all your content.
            </span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent
          class="rounded-md max-w-[375px] sm:max-w-[425px] pt-8"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="DeleteAccount">Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</template>
