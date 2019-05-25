<template class='mx-auto'>
  <div id="profile">
    <b-card
      title="Profile"
      img-src="https://picsum.photos/600/300/?image=25"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 30rem;"
      class="mb-2 text-center"
    >
      <div>
        <b>Name:</b>
        {{name}}
      </div>
      <div>
        <b>Email:</b>
        {{email}}
      </div>
      <div>
        <b>Create Date:</b>
        {{createDate|moment("dddd, MMMM Do YYYY, h:mm:ss a")}}
      </div>
      <div>
        <b>Last Update Date:</b>
        {{updateDate|moment("dddd, MMMM Do YYYY, h:mm:ss a")}}
      </div>
      <div>
        <b>Group:</b>
        {{group}}
      </div>
      <div v-if="$checkIsLocalLoginMethod">
        <b-button-group>
          <b-btn variant="success" @click="changePwdModal()">Change Password</b-btn>
        </b-button-group>
        <b-button-group>
          <router-link :to="{name:'tfa'}">
            <b-btn variant="primary">Two Factor Authentication</b-btn>
          </router-link>
        </b-button-group>
      </div>
    </b-card>
    <!--Change Password-->
    <b-modal
      size="lg"
      class="float-left modal-changePwd"
      ref="changePwdModalRef"
      hide-footer
      hide-header
      title="Change Password"
    >
      <ChangePwd/>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "profile",
  data() {
    return {
      uid: "",
      username: "",
      name: "",
      group: "",
      groupId: "",
      email: "",
      createDate: new Date(),
      updateDate: new Date(),
      defaultStorage: 0
    };
  },
  mounted() {
    this.getProfile();
    this.$root.$on("changePwdModal", () => {
      this.showChangePwdModal();
    });
  },
  methods: {
    getProfile() {
      this.$http.getMethod("users", {}).then(response => {
        let userInfo = response.data;
        this.username = userInfo.username;
        this.name = userInfo.name;
        this.group = userInfo.group.groupName;
        this.groupId = userInfo.group._id;
        this.email = userInfo.email;
        this.createDate = userInfo.createDT;
        this.updateDate = userInfo.updateDT;
      });
    },
    changePwdModal() {
      this.$root.$emit("changePwdModal");
    },
    showChangePwdModal() {
      this.$refs.changePwdModalRef.show();
    }
  }
};
</script>

<style scoped>
#profile {
  margin-top: 5%;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
