<template>
  <div id="adminDashboard">
    <Admin-Counter></Admin-Counter>
    <!--User List-->
    <b-modal
      size="lg"
      class="float-left modal-userList"
      ref="userListModalRef"
      hide-footer
      title="Users"
    >
      <Admin-User-List/>
    </b-modal>

    <!--User Create-->
    <b-modal
      size="lg"
      class="float-left modal-userCreate"
      ref="userCreateModalRef"
      hide-footer
      title="Create User"
    >
      <Admin-User-Create/>
    </b-modal>

    <!--User Edit-->
    <b-modal
      size="lg"
      class="float-left modal-userEdit"
      ref="userEditModalRef"
      hide-footer
      title="Edit User"
    >
      <Admin-User-Edit/>
    </b-modal>

    <!--Group Create-->
    <b-modal
      size="lg"
      class="float-left modal-groupCreate"
      ref="groupCreateModalRef"
      hide-footer
      :title="groupTitle"
    >
      <Admin-Group-Create/>
    </b-modal>

    <!--Group List-->
    <b-modal
      size="lg"
      class="float-left modal-groupList"
      ref="groupListModalRef"
      hide-footer
      title="Groups"
    >
      <Admin-Group-List/>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "adminDashboard",

  data() {
    return {
      groupTitle: ""
    };
  },
  mounted() {
    this.$root.$on("onUserCreate", () => {
      this.$refs.userCreateModalRef.show();
    });
    this.$root.$on("onUserList", () => {
      this.$refs.userListModalRef.show();
    });
    this.$root.$on("onGroupCreate", () => {
      this.groupTitle = "Create Group";
      this.$refs.groupCreateModalRef.show();
    });
    this.$root.$on("onGroupList", () => {
      this.$refs.groupListModalRef.show();
    });
    this.$root.$on("onGroupEdit", id => {
      this.groupTitle = "Edit Group";
      this.$refs.groupListModalRef.hide();
      this.$refs.groupCreateModalRef.show();
    });
    this.$root.$on("onEditUserModalOpen", id => {
      this.$refs.userListModalRef.hide();
      this.$refs.userEditModalRef.show();
    });
  },
  methods: {}
};
</script>

<style>
</style>
