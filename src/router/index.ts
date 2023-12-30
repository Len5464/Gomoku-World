import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import { Route } from "../typedef";
const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/rule", name: "rule", component: () => import("../views/GameRule.vue") },
  {
    path: "/game",
    name: "game",
    component: () => import("../views/Game.vue"),
    props: (route: Route) => ({
      size: Number(route.query.size),
      sec: Number(route.query.sec),
      players: route.query.players,
      roundType: route.query.roundType,
      gameType: route.query.gameType,
    }),
  },
  { path: "/:domain(.*)*", name: "NotFound", component: () => import("../views/404.vue") },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
