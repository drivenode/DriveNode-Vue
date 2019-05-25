<template>
  <div class="col-xm-12">
    <b-container fluid class="controlBar">
      <b-row>
        <b-col class="float-left">
          <b-form-input v-model="searchInput" type="text" placeholder="Enter key words"></b-form-input>
        </b-col>
        <b-col></b-col>
        <b-col class="float-right">
          <b-btn-group>
            <b-button
              size="md"
              class="compressBtn float-right controlBtn"
              variant="info"
              @click="compressBtnHandle()"
            >Compression</b-button>
            <b-button
              size="md"
              class="uploadModalBtn float-right controlBtn"
              variant="primary"
              @click="uploadBtnHandle()"
            >
              <font-awesome-icon :icon="['fas','file-upload']"/>Upload
            </b-button>
            <b-button
              size="md"
              class="dirModalBtn float-right controlBtn"
              variant="success"
              @click="dirBtnHandle()"
            >
              <font-awesome-icon :icon="['fas','file-upload']"/>Add directory
            </b-button>
          </b-btn-group>
        </b-col>
      </b-row>
      <b-row class="directoryPath">
        Current directory: /
        <span
          v-for="dir in currentDirPath"
          @click="toDir(dir)"
        >{{dir.pathName}} /</span>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "control",
  data() {
    return {
      searchInput: "",
      directoryTree: "",
      currentDirPath: []
    };
  },
  mounted() {
    this.$root.$on("onCurrentDirPath", arr => {
      this.currentDirPath = arr;
    });
  },
  methods: {
    uploadBtnHandle() {
      this.$root.$emit("uploadBtnOnClick");
    },
    dirBtnHandle() {
      this.$root.$emit("dirBtnOnClick");
    },
    compressBtnHandle() {
      this.$root.$emit("compressBtn");
    },
    toDir(item) {
      this.$root.$emit("controlToDir", item);
    }
  }
};
</script>

<style scoped>
.controlBar {
  padding-top: 1%;
  padding-bottom: 1%;
}
.float-left {
  float: left;
}
.directoryPath {
  padding-left: 2%;
  padding-right: 2%;
}
</style>
