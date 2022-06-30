import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  //首页
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: { title: "首页", icon: "el-icon-s-home" },
      },
    ],
  },
  //个人信息页面
  {
    path: "/myself",
    component: Layout,
    redirect: "/myself",
    children: [
      {
        path: "index",
        name: "Myself",
        component: () => import("@/views/myself/index"),
        meta: { title: "个人信息", icon: "el-icon-user-solid" },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  //考勤系统
  {
    path: "/attendance",
    component: Layout,
    redirect: "/attendance/manage",
    name: "Attendance",
    meta: { title: "考勤系统", icon: "el-icon-s-claim" },
    children: [
      {
        path: "manage",
        name: "Manage",
        component: () => import("@/views/attendance/manage/index"),
        meta: { title: "考勤管理", roles: ["admin"] },
      },
      {
        path: "record",
        name: "Record",
        component: () => import("@/views/attendance/record/index"),
        meta: { title: "考勤记录" },
      },
    ],
  },
  // 请假系统
  {
    path: "/leave",
    component: Layout,
    name: "Leave",
    meta: { title: "请假系统", icon: "el-icon-message-solid" },
    redirect: "/leave/apply",
    children: [
      {
        path: "apply",
        name: "Apply",
        component: () => import("@/views/leave/apply/index"),
        meta: { title: "请假申请" },
      },
      {
        path: "approval",
        name: "Approval",
        component: () => import("@/views/leave/approval/index"),
        meta: { title: "请假审批", roles: ["admin", "leader"] },
      },
      {
        path: "record",
        name: "Record",
        component: () => import("@/views/leave/record/index"),
        meta: { title: "请假记录" },
      },
      {
        path: "manage",
        name: "Manage",
        component: () => import("@/views/leave/manage/index"),
        meta: { title: "请假管理", roles: ["admin"] },
      },
    ],
  },
  // 员工系统
  {
    path: "/staff",
    component: Layout,
    name: "Staff",
    meta: {
      title: "员工系统",
      icon: "el-icon-s-custom",
      roles: ["admin", "leader"],
    },
    redirect: "/staff/manage",
    children: [
      {
        path: "manage",
        name: "Manage",
        component: () => import("@/views/staff/manage/index"),
        meta: { title: "员工管理", roles: ["admin"] },
      },
      {
        path: "list",
        name: "List",
        component: () => import("@/views/staff/list/index"),
        meta: { title: "员工列表", roles: ["admin", "leader"] },
      },
    ],
  },
  //部门系统
  {
    path: "/department",
    component: Layout,
    name: "Department",
    meta: {
      title: "部门系统",
      icon: "el-icon-s-platform",
      roles: ["admin", "leader"],
    },
    redirect: "/department/manage",
    children: [
      {
        path: "manage",
        name: "Manage",
        component: () => import("@/views/department/manage/index"),
        meta: { title: "部门管理", roles: ["admin"] },
      },
      {
        path: "list",
        name: "List",
        component: () => import("@/views/department/list/index"),
        meta: { title: "部门列表", roles: ["admin", "leader"] },
      },
    ],
  },
  // 404 page must be placed at the end !!!//必须要放置在所有路由最底部，包括异步引入的路由，否则会出现重新登录时重定向回退出前页面转到404的问题
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router//本质是创建一个新路由器，然后将旧路由器的matcher指向新路由器的matcher
}

export default router;
