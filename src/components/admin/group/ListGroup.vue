<template>
  <div id="ListGroup">
    <b-list-group>
      <b-list-group-item v-for="group in groups">
        <span class="float-left">{{group.groupName}}</span>
        <span class="float-right">
          <b-btn variant="primary" @click="getOneList(group._id)">Edit</b-btn>
        </span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      groups: []
    };
  },
  mounted() {
    this.$root.$on("onGroupList", () => {
      this.getGroups();
    });
  },
  methods: {
    getGroups() {
      this.$http.getMethod("admin/group", { scope: "all" }).then(res => {
        this.groups = res.data.data;
      });
    },
    getOneList(id) {
      this.$root.$emit("onGroupEdit", id);
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>