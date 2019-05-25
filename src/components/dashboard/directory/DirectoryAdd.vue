<template>
  <div>
    <div>
      <div>
        <b>Create Directory:</b>
        {{currectDir}}
      </div>
      <div>
        <b-form @submit="saveDir()" v-on:submit.prevent>
          <div>
            <b-form-group id="newDirInputGroup1" label="New Directory Name" label-for="newDir">
              <b-form-input
                class="md-col"
                v-model="form.newDirName"
                :state="!$v.form.newDirName.$invalid"
                id="newDir"
                placeholder="Directory Name"
              ></b-form-input>
              <b-form-invalid-feedback id="newDirLiveFeedback">This is a required field</b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div>
            <b-btn type="submit" variant="success" v-if="!isSaved">Save</b-btn>
            <b-btn variant="primary">Cancel</b-btn>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "createDirectory",
  data() {
    return {
      currectDir: "",
      form: { newDirName: "" },
      submitStatus: null,
      isSaved: false
    };
  },
  mounted() {
    this.$root.$on("dirBtnOnClick", () => {
      this.currectDir = localStorage.getItem("currentDirName");
    });
  },
  validations: {
    form: {
      newDirName: {
        required,
        minLength: minLength(1)
      }
    }
  },
  methods: {
    saveDir() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.submitStatus = "PENDING";
        let reqBody = {};
        reqBody.name = this.form.newDirName;
        if (localStorage.getItem("currentDir") != "root") {
          reqBody.parentDir = localStorage.getItem("currentDir");
        }
        this.$http
          .postMethod("dir", reqBody)
          .then(response => {
            isSaved = true;
            if (localStorage.getItem("currentDir") == "root") {
              reqBody.parentDir = null;
            }

            this.$root.$emit("dirList", reqBody.parentDir);
            this.$toasted.show("Directory " + reqBody.name + " added", {
              position: "bottom-right",
              duration: 5000,
              fitToScreen: true
            });
          })
          .catch(err => {
            this.$toasted.show("Directory " + reqBody.name + " not add", {
              type: "danger",
              position: "bottom-right",
              duration: 5000,
              fitToScreen: true
            });
          });
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
