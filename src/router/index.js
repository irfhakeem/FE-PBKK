import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: () => import("../views/LandingView.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/Setting.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/profile/:username",
      name: "profile",
      component: () => import("../views/Profile.vue"),
      props: (route) => ({ username: route.params.username }),
      meta: { requiresAuth: true },
    },
    {
      path: "/:username/:postId",
      name: "post",
      component: () => import("../views/Post.vue"),
      props: (route) => ({
        username: route.params.username,
        postId: route.params.postId,
      }),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/:username/lists/:listId",
      name: "lists",
      component: () => import("../views/DetailList.vue"),
      props: (route) => ({
        username: route.params.username,
        listId: route.params.listId,
      }),
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem("token");
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ name: "welcome" });
  } else {
    next();
  }
});

export default router;
