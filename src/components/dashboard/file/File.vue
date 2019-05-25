<template>
  <div class="col-md-8 filesList float-left">
    <div class>
      <h4>Files</h4>
    </div>
    <div class>
      <b-card class="text-left">
        <div class="empty" v-if="files.length<=0">No File in this directory</div>
        <div class="list" v-if="files.length>0">
          <b-list-group>
            <b-list-group-item
              button
              v-for="item in files"
              :key="item._id"
              @click="showFilePropertyModal(item._id,item.realname)"
            >
              <font-awesome-icon :icon="['fas', 'file']"/>
              {{item.realname}}
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-card>
    </div>
    <!--File Property-->
    <b-modal class="float-left" ref="filePropertyRef" :title="modalTitle" hide-footer>
      <FileProperty/>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "File",
  data() {
    return {
      files: [],
      selectedFileName: "",
      modalTitle: ""
    };
  },
  mounted() {
    this.$root.$on("fileListsOnChild", text => {
      if (text == "root") {
        this.Lists(null);
      } else {
        this.Lists(text);
      }
    });
    this.$root.$on("controlToDir", item => {
      if (item.id == "root") {
        this.Lists(null);
      } else {
        this.Lists(item.id);
      }
    });
    this.Lists(null);
    this.$root.$on("closeFileProperty", text => {
      this.hideFilePropertyModal();
    });
  },
  methods: {
    Lists(parentDir) {
      if (this.$auth.isAuthBool) {
        var param = {};
        if (parentDir) {
          param.dir = parentDir;
        }
        this.$http.getMethod("file", param).then(response => {
          if (response.data) {
            if (response.data.data.length > 0) {
              this.files = response.data.data;
            } else {
              this.files = [];
            }
          }
        });
      }
    },
    showFilePropertyModal(id, filename = null) {
      this.$root.$emit("FilePropertyOpen", id);
      this.selectedFileName = filename;
      this.$refs.filePropertyRef.show();
    },
    hideFilePropertyModal() {
      this.$refs.filePropertyRef.hide();
    }
  },
  watch: {
    selectedFileName() {
      this.modalTitle = "File name - " + this.selectedFileName;
    }
  }
};
</script>

<style scoped>
.filesList {
  float: right;
}
</style>
