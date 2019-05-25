<template>
  <div>
    <div>
      <div>
        <b-btn class="float-left" variant="primary" @click="uploadFile()">
          <font-awesome-icon :icon="['fas','file-upload']"/>Upload All
        </b-btn>
        <b-btn class="float-left" variant="danger" @click="removeAll()">Remove All</b-btn>
        <b-btn class="float-right addFile" variant="success" @click="addFile()">
          <font-awesome-icon :icon="['fas','plus']"/>Select File
        </b-btn>
      </div>
      <input
        type="file"
        ref="fileUpload"
        name="fileUpload"
        @change="onFileChange($event.target.files)"
        style="display:none"
        multiple
      >
    </div>
    <div>
      <b-table responsive striped hover :fields="fields" :items="selectedItems">
        <template slot="progress" slot-scope="data">
          <b-progress show-progress :max="max">
            <b-progress-bar variant="primary" :value="data.item.uploadProgress"></b-progress-bar>
          </b-progress>
        </template>
        <template slot="action" slot-scope="cell">
          <b-button-group>
            <b-btn
              variant="danger"
              size="sm"
              name="removeUploadFile"
              @click="uploadRemove(cell.item)"
            >Remove</b-btn>
          </b-button-group>
        </template>
        <template slot="preview" slot-scope="cell">
          <b-btn v-if='cell.item.preview'>
            Preview
          </b-btn>
        </template>
      </b-table>
    </div>
    <div>
      <Alert :variant="alertType" :show="alertMsg.length>0" :msg="alertMsg"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["endpoint"],
  data() {
    return {
      fields: ["fileName", "fileType", "status", "progress", "preview","action"],
      selectedItems: [],
      attachments: [],
      alertMsg: "",
      alertType: "",
      max: 100,
      values: [0],
      percentCompleted: "",
      isAllUpload: false
    };
  },
  mounted() {
    this.$root.$on("clearUpload", () => {
      this.clearAll();
    });
    this.$root.$on("bv::modal::hidden", modal => {
      console.log("modal" + modal);
      if (this.isAllUpload) {
        this.clearAll();
      }
    });
  },
  methods: {
    clearAll() {
      this.selectedItems = [];
      this.attachments = [];
      this.alertMsg = "";
      this.alertType = "";
      this.max = 100;
      this.values = [0];
      this.percentCompleted = "";
      this.isAllUpload = false;
    },
    addFile() {
      this.$refs.fileUpload.click();
    },
    onFileChange(file) {
      if (file.length > 0) {
        for (var i = 0; i < file.length; i++) {
          let selectFile = file[i];
          let json={
            fileName: selectFile.name,
            fileType: selectFile.type,
            status: "Added",
            uploadProgress: 0,
            preview:false
          }
          console.log("picture:"+selectFile.type.split('/'))
          if(selectFile.type.split('/')[0]=='image'){
            json.preview=true
          }
          console.log("preview: "+json.preview)
          this.selectedItems.push(json);
          this.attachments.push(selectFile);
        }
      }
    },
    uploadFile() {
      let me = this;
      let curDir = localStorage.getItem("currentDir");
      let token = localStorage.getItem("toekn");
      if (this.uploadFileValidator()) {
        for (var i = 0; i < this.selectedItems.length; i++) {
          var formData = new FormData();
          formData.append("fileUpload", this.attachments[i]);
          if (curDir != "root") {
            formData.append("dir", curDir);
          }
          this.selectedItems[i].status = "Pending";
          let a = i;
          var config = {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: function(progressEvent) {
              this.percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              this.selectedItems[a].uploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              this.$forceUpdate();
            }.bind(this)
          };

          axios
            .post(
              "fileupload/upload?token=" + localStorage.getItem("token"),
              formData,
              config
            )
            .then(response => {
              this.selectedItems[a].status = "Uploaded";
              this.$root.$emit("fileListsOnChild", curDir);
            })
            .catch(err => {
              me.selectedItems[a].status = "Failed";
            });
        }
        this.isAllUpload = true;
      }
    },
    uploadFileValidator() {
      if (this.selectedItems.length <= 0) {
        this.alertMsg = "Please select a file.";
        this.alertType = "danger";
        return false;
      } else {
        return true;
      }
    },
    uploadRemove(selectedItems) {
      let selected = this.selectedItems;
      const index = selected.indexOf(selectedItems - 1);
      selected.splice(index, 1);
      this.attachments.splice(index, 1);
    },
    removeAll() {
      this.selectedItems = [];
      this.attachments = [];
    }
  },
  watch: {
    selectedItems() {
      if (this.selectedItems.length > 0) {
        this.alertMsg = "";
        this.alertType = "";
      }
    }
  }
};
</script>

<style scoped>
.addFile {
  margin-bottom: 1%;
}
</style>
