<template>
  <div>
    <Control></Control>
    <DirectoryList></DirectoryList>
    <FileList></FileList>

    <!--Upload Modal-->
    <b-modal
      size="lg"
      class="float-left modal-upload"
      ref="uploadModalRef"
      hide-footer
      title="Upload"
    >
      <Upload/>
    </b-modal>
    <!--Directory Add Modal-->
    <b-modal
      size="lg"
      class="float-left modal-dirAdd"
      ref="dirAddModalRef"
      hide-footer
      title="Create Directory"
    >
      <DirectoryAdd/>
    </b-modal>
    <!--File Compress-->
    <b-modal
      size="lg"
      class="float-left modal-compress"
      ref="compressModalRef"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      title="File Compression"
      @hidden="onHiddenCompress"
    >
      <Compress/>
    </b-modal>
    <b-modal
      size="lg"
      class="modal-preview"
      ref="previewModal"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <Preview></Preview>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      isLogin: false,
      uploadModal: false,
      uploadModalRef: ""
    };
  },
  mounted() {
    this.$root.isLogin = this.$auth.isAuth();
    this.isLogin = this.$auth.isAuth();
    console.log(this.isLogin);

    this.$root.$on("uploadBtnOnClick", () => {
      this.showUploadModal();
    });
    this.$root.$on("closeUploadModal", () => {
      this.hideUploadModal();
    });
    this.$root.$on("dirBtnOnClick", () => {
      this.showDirAddModal();
    });
    this.$root.$on("closeDirAdd", () => {
      this.closeDirAddModal();
    });
    this.$root.$on("onFileItemAdded", fileJson => {
      this.$refs.compressModalRef.show();
    });
    this.$root.$on("compressBtn", fileJson => {
      this.$refs.compressModalRef.show();
    });
    this.$root.$on("onPreviewFileId", (fileId, mimeType) => {
      this.$refs.previewModal.show();
    });
  },
  methods: {
    showUploadModal() {
      this.$refs.uploadModalRef.show();
    },
    hideUploadModal() {
      this.$refs.uploadModalRef.hide();
    },
    showDirAddModal() {
      this.$refs.dirAddModalRef.show();
    },
    closeDirAddModal() {
      this.$refs.dirAddModalRef.hide();
    },
    onHiddenCompress(evt) {
      this.$root.$emit("onHideCompress");
    }
  }
};
</script>

<style>
.modal-upload {
  width: 100%;
}
</style>
