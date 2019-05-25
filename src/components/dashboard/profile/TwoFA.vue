<template class='mx-auto'>
  <div id="TwoFA">
    <b-img v-if="isQrCode" :src="imageUrl" center="true"/>
    <div v-if="isQrCode">Secret: {{secret}}</div>
    <b-button-group>
      <b-button
        v-if="!isQrCode"
        variant="success"
        @click="genSecret()"
      >Generate Two Factory Auth Secret</b-button>
    </b-button-group>
  </div>
</template>

<script>
export default {
  name: "tfa",
  data() {
    return {
      isGen: false,
      isQrCode: false,
      secret: "",
      imageUrl: ""
    };
  },
  mounted() {
    this.getStoreSecret();
  },
  methods: {
    getStoreSecret() {
      this.$http
        .getMethod("users/checktfaSec", {})
        .then(data => {
          console.log(data);
          if (data.data.success) {
            this.secret = data.data.data.secret;
            this.imageUrl = data.data.data.image;
            this.isQrCode = true;
          } else {
            this.isQrCode = false;
          }
        })
        .catch(err => {});
    },
    genSecret() {
      this.$http
        .postMethod("users/gettotpSecret", {})
        .then(data => {
          console.log(data);
          this.secret = data.data.data.secret;
          this.imageUrl = data.data.data.image;
          this.isQrCode = true;
        })
        .catch(err => {});
    }
  }
};
</script>