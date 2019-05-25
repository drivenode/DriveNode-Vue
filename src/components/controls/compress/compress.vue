<template>
  <div id="compress">
    <div v-if="fileItems.length<=0">No file selected</div>
    <div v-if="fileItems.length>0">
      <b-row>
        <div class="float-right">
          <b-btn
            variant="success"
            :disabled="(compressConfirm||compressBtn)||fileItems.length<=0"
            @click="compressFileBtn()"
          >Compress All</b-btn>
        </div>
        <div>
          <b-form-group label="Format">
            <b-form-radio-group
              v-model="compressFormat"
              :options="formatOptions"
              name="radioInline"
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </b-row>
      <b-row>
        <b-table responsive hover :items="fileItems" :fields="fields">
          <template slot="action" slot-scope="cell">
            <b-button-group>
              <b-btn
                variant="danger"
                size="sm"
                name="removeItemFile"
                @click="removeItem(cell.item)"
                :disabled="compressConfirm||compressBtn"
              >Remove</b-btn>
            </b-button-group>
          </template>
        </b-table>
      </b-row>
      <b-row v-if="compressBtn">
        <b-col>
          <div>
            Confirm compress {{fileItems.length}} files?
            <div>
              <b-btn-group>
                <b-btn
                  @click="confirmCompress()"
                  variant="success"
                  :disabled="compressSuccess"
                >Confirm</b-btn>
                <b-btn @click="cancelCompress()" variant="danger" :disabled="compressSuccess">Cancel</b-btn>
              </b-btn-group>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "compress",
  data() {
    return {
      compressFiles: [],
      fields: [
        { key: "fileName", sortable: true },
        { key: "fileType", sortable: true },
        { key: "fileSize", sortable: true },
        { key: "action", label: "action" }
      ],
      fileItems: [],
      compressFormat: "zip",
      formatOptions: [
        { text: "Zip", value: "zip", default: true },
        { text: "Tar", value: "tar" }
      ],
      compressConfirm: false,
      compressBtn: false,
      compressSuccess: false
    };
  },
  mounted() {
    this.$root.$on("onFileItemAdded", fileJson => {
      if (fileJson) {
        this.addFile(fileJson);
      }
    });
    this.$root.$on("onHideCompress", () => {
      if (this.compressSuccess) {
        this.clearAll();
      }
    });
  },
  methods: {
    clearAll() {
      this.fileItems = [];
      this.compressConfirm = false;
      this.compressBtn = false;
      this.compressSuccess = false;
      this.compressFiles = [];
      this.compressFormat = "zip";
    },
    addFile(fileJson) {
      this.fileItems.push(fileJson);
    },
    removeItem(fileItem) {
      this.fileItems.splice(this.fileItems.indexOf(fileItem), 1);
    },
    compressFileBtn() {
      this.compressBtn = true;
    },
    cancelCompress() {
      this.compressBtn = false;
      this.compressConfirm = false;
    },
    confirmCompress() {
      this.compressConfirm = true;
      let arrFiles = this.fileItems;
      let arr = [];
      for (var i = 0; i < arrFiles.length; i++) {
        arr.push(arrFiles[i].fileId);
      }

      this.$http.downloadCompress(arr, this.compressFormat).then(response => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        var extension = "";
        if (this.compressFormat == "zip") {
          extension = "zip";
        } else {
          extension = "tar.gz";
        }
        link.setAttribute("download", "download." + extension); //or any other extension
        document.body.appendChild(link);
        link.click();
        this.compressSuccess = true;
        this.$toasted.show("Download started", {
          position: "bottom-right",
          duration: 5000,
          fitToScreen: true
        });
      });
    }
  }
};
</script>

<style scoped>
#compress {
  padding: 1%;
}
</style>