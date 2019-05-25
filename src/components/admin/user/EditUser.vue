<template>
  <div id="editUser">
    <Alert :msg="alertMsg" :color="alertType" :show="alertMsg.length>0"/>
    <b-form @submit="saveEditUser" novalidate v-on:submit.prevent>Username:
      <b-input disabled v-model="form.username"></b-input>
      <b-form-group
        id="name"
        label="Name"
        label-for="nameInput"
        :invalid-feedback="nameInvalidFeedback"
        :valid-feedback="nameValidFeedback"
        :state="nameState"
      >
        <b-form-input id="nameInput" :state="nameState" v-model.trim="form.name"></b-form-input>
      </b-form-group>
      <b-form-group
        id="email"
        label="Email"
        label-for="emailInput"
        :invalid-feedback="emailInvalidFeedback"
        :valid-feedback="emailValidFeedback"
        :state="emailState"
      >
        <b-form-input id="emailInput" :state="emailState" v-model.trim="form.email"></b-form-input>
      </b-form-group>
      <b-form-group
        id="group"
        label="Group"
        label-for="groupInput"
        :invalid-feedback="groupInvalidFeedback"
        :valid-feedback="groupValidFeedback"
        :state="groupState"
      >
        <b-form-select v-model="form.group._id" :state="groupState">
          <option value>Please select an option</option>
          <option :value="item._id" v-for="item in groups">{{item.groupName}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Activate">
        <b-form-radio-group v-model="form.activate" :options="activateOptions" name="radioInline"></b-form-radio-group>
      </b-form-group>
      <b-btn variant="info" type="submit" :disabled="isSuccess">Save</b-btn>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "EditUser",
  data() {
    return {
      alertMsg: "",
      alertType: "",
      groups: [],
      form: {
        _id: "",
        username: "",
        email: "",
        name: "",
        group: { groupName: "", _id: "" },
        activate: false
      },
      nameStatus: false,
      emailStatus: false,
      groupStatus: false,
      isSuccess: false,
      activateOptions: [
        { text: "Activate", value: true },
        { text: "Deactivate", value: false }
      ]
    };
  },
  mounted() {
    this.$root.$on("onEditUserModalOpen", uid => {
      this.clearAlert();
      this.listUser(uid);
      this.getGroup();
      this.isSuccess = false;
    });
  },
  methods: {
    getGroup() {
      this.$http.getMethod("admin/group", {}).then(res => {
        this.groups = res.data.data;
      });
    },
    listUser(id) {
      this.$http
        .getMethod("admin/user/" + id, {})
        .then(res => {
          this.form = res.data.data;
        })
        .catch(err => {});
    },
    clearAlert() {
      this.alertMsg = "";
      this.alertType = "";
    },
    saveEditUser() {
      if (this.nameStatus && this.emailStatus && this.groupStatus) {
        let json = {};
        json.uid = this.form._id;
        json.email = this.form.email;
        json.group = this.form.group._id;
        json.name = this.form.name;
        json.activate = this.form.activate;
        this.$http
          .putMethod("/admin/user/" + this.form._id, json)
          .then(res => {
            this.alertMsg = "Saved";
            this.alertType = "success";
            this.isSuccess = true;
          })
          .catch(err => {
            this.alertMsg = err.response.data.msg;
            this.alertType = "danger";
            this.isSuccess = false;
          });
      } else {
        this.alertType = "danger";
        this.alertMsg = "Please enter all field";
      }
    }
  },
  computed: {
    nameState() {
      return this.form.name.length > 0 ? true : false;
    },
    nameInvalidFeedback() {
      if (this.form.name.length > 0) {
        this.nameStatus = true;
        return "";
      } else {
        return "Please enter something";
      }
    },
    nameValidFeedback() {
      return this.state === true ? "Valid" : "";
    },
    emailState() {
      return this.emailStatus;
    },
    emailInvalidFeedback() {
      if (this.form.email.length > 0) {
        let emailArr = this.form.email.split("@");
        if (emailArr.length <= 1) {
          this.emailStatus = false;
          return "Must include @";
        } else {
          this.emailStatus = true;
          return "";
        }
      } else {
        this.emailStatus = false;
        return "Please enter your email";
      }
    },
    emailValidFeedback() {
      return this.state === true ? "Valid" : "";
    },
    groupState() {
      return this.groupStatus;
    },
    groupInvalidFeedback() {
      if (this.form.group._id.length > 0) {
        this.groupStatus = true;
        return "";
      } else {
        this.groupStatus = false;
        return "Please choose a group";
      }
    },
    groupValidFeedback() {
      return this.state === true ? "Valid" : "";
    }
  },
  watch: {}
};
</script>