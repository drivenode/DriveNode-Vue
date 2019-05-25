<template>
  <div id="counter">
    <b-container class="bv-dashboard-row">
      <b-row>
        <b-col>
          <b-card title="Total Users" class="dashboardCount">
            <div class="counter">{{usersCount}}</div>
            <div>
              <b-btn-group>
                <b-btn
                  class="btn-success"
                  @click="listUser()"
                  v-if="ckPermission({listUser:true})"
                >List User</b-btn>
                <b-btn
                  class="btn-info"
                  v-if="ckPermission({createUser:true})"
                  @click="createUserBtn()"
                >Create User</b-btn>
              </b-btn-group>
            </div>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="Total Group" class="dashboardCount">
            <div class="counter">{{groupsCount}}</div>
            <div>
              <b-btn-group>
                <b-btn
                  class="btn-success"
                  @click="listGroup()"
                  v-if="ckPermission({createGroup:true})"
                >List Group</b-btn>
                <b-btn
                  class="btn-info"
                  v-if="ckPermission({createGroup:true})"
                  @click="createGroupBtn()"
                >Create Group</b-btn>
              </b-btn-group>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card title="Total Files" tag="a" style class="dashboardCount">
            <div class="counter">{{filesCount}}</div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      usersCount: 0,
      filesCount: 0,
      dirsCount: 0,
      groupsCount: 0
    };
  },
  mounted() {
    this.getUsersCount();
    this.getFilesCount();
    this.getDirCount();
    this.getGroupCount();
  },
  methods: {
    getUsersCount() {
      this.$http.getMethod("admin/count/user", {}).then(response => {
        this.usersCount = response.data.data.count;
      });
    },
    getFilesCount() {
      this.$http.getMethod("admin/count/file", {}).then(response => {
        this.filesCount = response.data.data.count;
      });
    },
    getDirCount() {
      this.$http.getMethod("admin/count/dir", {}).then(response => {
        this.dirsCount = response.data.data.count;
      });
    },
    getGroupCount() {
      this.$http.getMethod("admin/count/group", {}).then(response => {
        this.groupsCount = response.data.data.count;
      });
    },
    ckPermission(json) {
      return this.$auth.checkAdminPermission(json);
    },
    listUser() {
      this.$root.$emit("onUserList");
    },
    listGroup() {
      this.$root.$emit("onGroupList");
    },
    createUserBtn() {
      this.$root.$emit("onUserCreate");
    },
    createGroupBtn() {
      this.$root.$emit("onGroupCreate");
    }
  }
};
</script>

<style scoped>
.bv-dashboard-row {
  margin-top: 2%;
}
.counter {
  font-size: 30px;
}
.dashboardCount {
  margin-bottom: 2%;
}
</style>