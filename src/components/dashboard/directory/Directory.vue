<template>
  <div class="col-md-4 dirList">
    <h4>
      <font-awesome-icon :icon="['fas', 'folder']"/>Directories
    </h4>
    <b-card class="text-center">
      <div class="empty" v-if="dir.length<=0">
        <b-list-group>
          <b-list-group-item button @click="dirTo(null,'root')">Home</b-list-group-item>
        </b-list-group>
      </div>
      <div class="dir" v-if="dir.length>0">
        <b-list-group>
          <b-list-group-item button @click="dirTo(null,'root')">Home</b-list-group-item>
          <b-list-group-item
            button
            v-for="item in dir"
            :key="item._id"
            @click="dirTo(item._id,item.dirName)"
          >{{item.dirName}}</b-list-group-item>
        </b-list-group>
      </div>
    </b-card>
  </div>
</template>

<script>
import File from "../file/File";
export default {
  name: "directory",
  data() {
    return {
      dir: []
    };
  },
  mounted() {
    this.$root.$on("dirList", parentDir => {
      if (parentDir == "root") {
        parentDir = null;
      }
      this.Lists(parentDir);
    });
    this.$root.$on("controlToDir", item => {
      this.$root.$emit("dirList", item.id);
      this.PathUpdate(item);
    });
    this.Lists(null);
    this.CurrentDir(null, "root");
  },
  methods: {
    dirTo(id, name) {
      this.$root.$emit("fileListsOnChild", id);
      this.Lists(id);
      this.CurrentDir(id, name);
    },
    Lists(parentDir) {
      if (this.$auth.isAuthBool) {
        var param = {};
        if (parentDir) {
          param.parentDir = parentDir;
        } else {
          param.parentDir = null;
        }
        this.$http
          .getMethod("dir", param)
          .then(response => {
            if (response.data && response.data.data.length > 0) {
              this.dir = response.data.data;
            } else {
              this.dir = [];
            }
          })
          .catch(error => {});
      }
    },
    CurrentDir(id, name) {
      let currentPath = { id: id, pathName: name };
      localStorage.removeItem("currentDir");
      localStorage.removeItem("currentDirName");
      if (id) {
        localStorage.setItem("currentDir", id);
        localStorage.setItem("currentDirName", name);
        let json = { path: [currentPath] };
        if (localStorage.getItem("dirPath")) {
          let path = JSON.parse(localStorage.getItem("dirPath"));
          path.path.push(currentPath);
          localStorage.setItem("dirPath", JSON.stringify(path));
          this.$root.$emit("onCurrentDirPath", path.path);
        } else {
          localStorage.setItem("dirPath", JSON.stringify(json));
          this.$root.$emit("onCurrentDirPath", json.path);
        }
      } else {
        localStorage.setItem("currentDir", "root");
        localStorage.setItem("currentDirName", "root");
        currentPath = { id: "root", pathName: "root" };
        let json = { path: [currentPath] };
        localStorage.removeItem("dirPath");
        localStorage.setItem("dirPath", JSON.stringify(json));
        this.$root.$emit("onCurrentDirPath", json.path);
      }
    },
    PathUpdate(item) {
      let path = JSON.parse(localStorage.getItem("dirPath"));
      let array = path.path;
      let index = array.findIndex(x => x.id === item.id);
      if (localStorage.getItem("currentDir") != item.id) {
        array.splice(index + 1, array.length);
        let json = { path: array };
        localStorage.setItem("dirPath", JSON.stringify(json));
        this.$root.$emit("onCurrentDirPath", json.path);
      }
    },
    remove(array, element) {
      return array.splice(element);
    }
  }
};
</script>

<style scoped>
.dirList {
  float: left;
}
</style>
