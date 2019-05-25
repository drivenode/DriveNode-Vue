<template>
  <div>
    <b-table striped hover responsive :fields="usersField" :items="users">
      <template slot="action" slot-scope="cell" v-if="ckPermission({createUser:true})">
        <b-button-group>
          <b-btn variant="info" size="sm" name="Edit" @click="editUserBtn(cell.item)">Edit</b-btn>
        </b-button-group>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "userList",
  data() {
    return {
      usersField: {
        //action: {},
        username: { key: "username", sortable: true },
        Activate: { key: "activate", label: "Activate", sortable: true },
        email: { key: "email", sortable: true },
        groupName: {
          label: "Group",
          key: "group.groupName",
          sortable: true
        }
      },
      users: []
    };
  },
  created() {
    if (this.ckPermission({ createUser: true })) {
      this.usersField["action"] = { key: "action", label: "Edit" };
    }
  },
  mounted() {
    this.$root.$on("onUserList", () => {
      this.getUserList();
    });
  },
  methods: {
    ckPermission(json) {
      return this.$auth.checkAdminPermission(json);
    },
    getUserList() {
      this.$http
        .getMethod("admin/user", { scope: "all" })
        .then(res => {
          this.users = res.data.data;
        })
        .catch(err => {});
    },
    editUserBtn(json) {
      this.$root.$emit("onEditUserModalOpen", json._id);
    }
  }
};
</script>

<style scoped>
</style>