import Admin from "@/components/admin/Dashboard";
import Counter from "@/components/admin/counter/counter";
import Config from "@/components/admin/config/config";

export default [
  {
    path: "/Admin",
    name: "dashboard",
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: "/Admin/config",
    name: "config",
    component: Config,
    meta: { requiresAuth: true },
  }
];
