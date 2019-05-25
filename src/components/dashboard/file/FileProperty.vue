<template>
  <div>
    <div v-if="!renameOpen">File name: {{filename}}</div>
    <div v-if="renameOpen">
      <b-input-group prepend="File name:">
        <b-form-input v-model="fileNameOnly">{{fileNameOnly}}</b-form-input>
      </b-input-group>
    </div>
    <div>File Type: {{mimetype}}</div>
    <div>Size: {{convertSize}}</div>
    <div>Create Date: {{createDate|moment("dddd, MMMM Do YYYY, h:mm:ss a")}}</div>
    <div v-if="!deleteDialog">
      <b-button-group>
        <b-button variant="success" v-if="!renameOpen" @click="downloadFile(fileId)">Download</b-button>
        <b-button variant="outline-success" v-if="renameOpen" @click="renameFileClick()">Rename</b-button>
        <b-button variant="primary" @click="renameOpenField()">{{renameBtn}}</b-button>
        <b-button variant="danger" v-if="!renameOpen" @click="deleteBtn()">Delete</b-button>
        <b-button variant="info" @click="addCompressFile()">Add file to compress</b-button>
      </b-button-group>
      <div>
        <b-button variant="info" @click="previewFile()">Preview</b-button>
      </div>
    </div>

    <div v-if="deleteDialog">
      <div>
        <b>Are you sure to delete {{filename}}?</b>
      </div>
      <div>
        <b-button-group>
          <b-button variant="danger" @click="deleteFile()">Confirm</b-button>
          <b-button variant="success" @click="deleteBtn()">Close</b-button>
        </b-button-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileProperty",
  data() {
    return {
      filename: "",
      createDate: "",
      mimetype: "",
      owner: "",
      realname: "",
      share: { isSahre: false },
      size: 0,
      convertSize: "",
      fileId: "",
      renameOpen: false,
      fileNameOnly: "",
      deleteDialog: false,
      renameBtn: "Rename"
    };
  },
  mounted() {
    this.$root.$on("FilePropertyOpen", id => {
      this.getFileDetailById(id);
    });
    this.$root.$on("FilePropertyClose", () => {
      this.hideFilePropertyModal();
    });
  },
  methods: {
    hideFilePropertyModal() {
      this.deleteDialog = false;
    },
    getFileDetailById(id) {
      this.$http.getMethod("file/info/" + id, {}).then(response => {
        if (response.data && response.data.success) {
          var json = response.data.data;
          this.createDate = json.createDate;
          this.filename = json.realname;
          this.mimetype = json.mimetype;
          this.owner = json.owner;
          this.size = json.size;
          this.fileId = json._id;
          if (json.share) {
            this.share.isSahre = json.share.isShare;
          } else {
            this.share.isSahre = "";
          }
        }
      });
    },
    downloadFile(id) {
      this.$http.downloadMobileMethod(id);
      /*
      this.$http.downloadMethod(id).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.filename); //or any other extension
        document.body.appendChild(link);
        link.click();
        this.$toasted.show("Download started", {
          position: "bottom-right",
          duration: 2000,
          fitToScreen: true
        });
      });
      */
    },
    renameOpenField() {
      this.renameOpen = !this.renameOpen;
    },
    renameFileClick() {
      let filename = this.fileNameOnly;
      let json = { filename: filename };
      this.$http
        .putMethod("file/" + this.fileId, json)
        .then(response => {
          if (response) {
            this.renameOpen = false;
            this.$root.$emit(
              "fileListsOnChild",
              localStorage.getItem("currentDir")
            );
            this.getFileDetailById(this.fileId);
            this.$toasted.show("Rename successfully", {
              position: "bottom-right",
              duration: 5000,
              fitToScreen: true
            });
          }
        })
        .catch(err => {
          this.$toasted.show("Rename error", {
            type: "error",
            position: "bottom-right",
            duration: 5000,
            fitToScreen: true
          });
        });
    },
    deleteBtn() {
      this.deleteDialog = !this.deleteDialog;
    },
    deleteFile() {
      let fileId = this.fileId;
      this.$http
        .deleteMethod("file/" + fileId)
        .then(response => {
          this.$root.$emit(
            "fileListsOnChild",
            localStorage.getItem("currentDir")
          );
          this.$root.$emit("closeFileProperty");
          this.hideFilePropertyModal();
          this.$toasted.show("File " + this.filename + " deleted", {
            position: "bottom-right",
            duration: 5000,
            fitToScreen: true
          });
        })
        .catch(err => {});
    },
    addCompressFile() {
      let json = {};
      json.fileId = this.fileId;
      json.fileName = this.filename;
      json.fileSize = this.size;
      json.fileType = this.mimetype;
      this.$root.$emit("onFileItemAdded", json);
    },
    previewFile() {
      if (this.fileId != "") {
        console.log(this.mimetype);
        this.$root.$emit("onPreviewFileId", this.fileId, this.mimetype);
      }
    }
  },
  watch: {
    size() {
      this.convertSize = this.size;
    },
    filename() {
      let arr = this.filename.split(".");
      arr.pop();
      let name = "";
      for (var i = 0; i < arr.length; i++) {
        if (name.length > 0) {
          name = name + "." + arr[i];
        } else {
          name = arr[i];
        }
      }
      this.fileNameOnly = name;
    },
    renameOpen() {
      if (this.renameOpen) {
        this.renameBtn = "Close";
      } else {
        this.renameBtn = "Rename";
      }
    }
  }
};
</script>

<style scoped>
</style>
