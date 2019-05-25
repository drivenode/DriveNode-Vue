<template>
  <b-navbar v-if="isLogin" toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">DriveNode</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item v-for="navItem in menu.navItems" :to="navItem.href">{{navItem.name}}</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{name}}</em>
          </template>
          <b-dropdown-item
            v-for="drop in menu.dropdownItem"
            :to="drop.href"
            v-if="drop.hide"
          >{{drop.name}}</b-dropdown-item>
          <b-dropdown-item @click="logout">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>


<script>
export default {
  name: "navbar",
  component: "Navbar",
  data() {
    return {
      name: "",
      isLogin: false,
      isAdmin: false,
      menu: {
        navItems: [{ href: "/", name: "Home", click: "" }],
        dropdownItem: [
          { href: "/profile/", name: "Profile", click: "", hide: true },
          {
            href: "/profile/changePwd/",
            name: "Change Password",
            click: "",
            hide: !this.$checkIsLocalLoginMethod
          }
        ]
      }
    };
  },
  created() {
    this.$root.$on("setNav", () => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.name = userInfo.name;
      this.checkIsAdmin();
      this.isLogin = this.$auth.isAuth();
    });
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.name = userInfo.name;
    this.checkIsAdmin();
    this.isLogin = this.$auth.isAuth();
  },
  methods: {
    logout() {
      this.$auth.logout();
      this.$root.isLogin = this.$auth.isAuth();
      this.isLogin = this.$auth.isAuth();
      this.$router.go({ path: "login" });
    },
    checkIsAdmin() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.isAdmin = userInfo.isAdmin;
      if (this.isAdmin) {
        this.menu.dropdownItem.push({
          href: "/admin/",
          name: "Dashboard",
          click: "",
          hide: true
        });
      }
    },
    setLogin(value) {
      this.isLogin = value;
    }
  }
};
</script>
