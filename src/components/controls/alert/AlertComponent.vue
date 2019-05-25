<template>
  <b-alert :variant="color"
             :show="show"
             @dismissed="showDismissibleAlert">
      {{msg}}
  </b-alert>
</template>
<script>
  export default {
    name:'AlertComponent',
    component:'Alert',
    props:['msg','color','show'],
    data(){
      return {

        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: true
      }
    },
    methods: {
      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
      }
    }
  }
</script>
