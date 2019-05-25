<template>
  <div>
    <b-form @submit="submitGroup()" v-on:submit.prevent>
      <Alert :msg="alertMsg" :color="alertType" :show="alertMsg.length>0"></Alert>
      <b-form-group
        id="groupName"
        label="Group Name"
        label-for="groupnameInput"
        :invalid-feedback="groupnameInvalidFeedback"
        :valid-feedback="groupnameValidFeedback"
        :state="groupnameState"
      >
        <b-form-input id="groupnameInput" :state="groupnameState" v-model.trim="form.name"></b-form-input>
      </b-form-group>
      <div>
        <b-form-checkbox id="checkAll" v-model="checkAll" value="true" unchecked-value="false"/>Check All
      </div>
      <div>
        <b-row>
          <b-col></b-col>
          <b-col>Create/Upload</b-col>
          <b-col>List</b-col>
          <b-col>Delete</b-col>
        </b-row>
        <b-row>
          <b-col>File</b-col>
          <b-col>
            <b-form-checkbox
              id="fileUpload"
              v-model="form.fileUpload"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col>
            <b-form-checkbox
              id="fileList"
              v-model="form.fileList"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col>
            <b-form-checkbox
              id="fileDelete"
              v-model="form.fileDelete"
              value="true"
              unchecked-value="false"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>Directory</b-col>
          <b-col>
            <b-form-checkbox
              id="dirCreate"
              v-model="form.dirCreate"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col>
            <b-form-checkbox
              id="dirList"
              v-model="form.dirList"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col>
            <b-form-checkbox
              id="dirDelete"
              v-model="form.dirDelete"
              value="true"
              unchecked-value="false"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>User</b-col>
          <b-col>
            <b-form-checkbox
              id="createUser"
              v-model="form.createUser"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col>
            <b-form-checkbox
              id="listUser"
              v-model="form.listUser"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col>Group</b-col>
          <b-col>
            <b-form-checkbox
              id="createGroup"
              v-model="form.createGroup"
              value="true"
              unchecked-value="false"
            />
          </b-col>
          <b-col></b-col>
          <b-col></b-col>
        </b-row>
      </div>
      <div>
        <b-btn class="btn-block" type="submit" :disabled="!groupnameStatus" v-if="!isSuccess">Submit</b-btn>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "CreateGroup",
  data() {
    return {
      state: false,
      groupnameStatus: false,
      isSuccess: false,
      groupId: null,
      form: {
        name: "",
        defaultStorage: 0,
        dirList: false,
        dirCreate: false,
        dirDelete: false,
        fileUpload: false,
        fileList: false,
        fileDelete: false,
        createUser: false,
        createGroup: false,
        listUser: false
      },
      checkAll: false,
      alertMsg: "",
      alertType: "",
      alertCount: ""
    };
  },
  mounted() {
    this.$root.$on("onGroupCreate", () => {
      this.clearForm();
    });
    this.$root.$on("onGroupEdit", id => {
      this.clearForm();
      this.editInit(id);
    });
  },
  methods: {
    checkAllBox() {
      this.form.dirList = true;
      this.form.dirCreate = true;
      this.form.dirDelete = true;
      this.form.fileUpload = true;
      this.form.fileList = true;
      this.form.fileDelete = true;
      this.form.createUser = true;
      this.form.createGroup = true;
      this.form.listUser = true;
    },
    uncheckAllBox() {
      this.form.dirList = false;
      this.form.dirCreate = false;
      this.form.dirDelete = false;
      this.form.fileUpload = false;
      this.form.fileList = false;
      this.form.fileDelete = false;
      this.form.createUser = false;
      this.form.createGroup = false;
      this.form.listUser = false;
    },
    clearForm() {
      this.alertMsg = "";
      this.alertType = "";
      this.isSuccess = false;
      this.groupId = null;
      this.form.dirList = false;
      this.form.dirCreate = false;
      this.form.dirDelete = false;
      this.form.fileUpload = false;
      this.form.fileList = false;
      this.form.fileDelete = false;
      this.form.createUser = false;
      this.form.createGroup = false;
      this.form.listUser = false;
      this.form.name = "";
    },
    submitGroup() {
      let json = {};
      json = this.form;
      if (this.groupId) {
        this.saveGroup(json);
      } else {
        this.createGroup(json);
      }
    },
    saveGroup(json) {
      if (this.groupId && this.form.name != "admin") {
        this.$http
          .putMethod("admin/group/" + this.groupId, json)
          .then(res => {
            this.isSuccess = true;
            this.alertMsg = "Group [" + this.form.name + "] saved";
            this.alertType = "success";
            this.$toasted.show("Group [" + this.form.name + "] saved", {
              position: "bottom-right",
              duration: 5000,
              fitToScreen: true
            });
          })
          .catch(err => {
            this.alertMsg = err.response.data.msg;
            this.alertType = "danger";
            this.$toasted.show("Group [" + this.form.name + "] not saved", {
              position: "bottom-right",
              duration: 10000,
              fitToScreen: true
            });
          });
      }
    },
    createGroup(json) {
      this.$http
        .postMethod("admin/group", json)
        .then(res => {
          this.isSuccess = true;
          this.alertMsg = "Group [" + this.form.name + "] saved";
          this.alertType = "success";
          this.$toasted.show("Group " + this.form.name + " added", {
            position: "bottom-right",
            duration: 5000,
            fitToScreen: true
          });
        })
        .catch(err => {
          this.alertMsg = err.response.data.msg;
          this.alertType = "danger";
          this.$toasted.show("Group " + this.form.name + " not added", {
            position: "bottom-right",
            duration: 10000,
            fitToScreen: true
          });
        });
    },
    editInit(id) {
      let json = {};
      json._id = id;
      this.$http
        .getMethod("admin/group/" + id, json)
        .then(res => {
          let data = res.data.data;
          this.groupId = id;
          this.form.dirList = data.dir.list;
          this.form.dirCreate = data.dir.create;
          this.form.dirDelete = data.dir.delete;
          this.form.fileUpload = data.files.upload;
          this.form.fileList = data.files.list;
          this.form.fileDelete = data.files.delete;
          this.form.createUser = data.createUser;
          this.form.createGroup = data.createGroup;
          this.form.listUser = data.listUser;
          this.form.name = data.groupName;

          if (this.form.name == "admin") {
            this.isSuccess = true;
          }
        })
        .catch(err => {});
    }
  },
  computed: {
    groupnameState() {
      return this.form.name.length > 0 ? true : false;
    },
    groupnameInvalidFeedback() {
      if (this.form.name.length > 0) {
        this.groupnameStatus = true;
        return "";
      } else {
        this.groupnameStatus = false;
        return "Please enter something";
      }
    },
    groupnameValidFeedback() {
      return this.state === true ? "Valid" : "";
    }
  },
  watch: {
    checkAll() {
      if (this.checkAll == "true") {
        this.checkAllBox();
      } else if (this.checkAll == "false") {
        this.uncheckAllBox();
      }
    }
  }
};
</script>

<style scoped>
</style>