<template>
  <div id="app">
    <ErrorHandler/>
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      token: ""
    };
  },
  mounted() {
    localStorage.removeItem("currentDir");
    localStorage.setItem("currentDir", "root");
    if (!this.$root.isLogin) {
      this.$router.push("Login");
    }
  },
  watch: {
    token() {
      if (localStorage.getItem("token").length <= 0) {
        console.log("logout");
      }
    }
  }
};
</script>

<style>
body {
  background: #eee !important;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}
</style>
