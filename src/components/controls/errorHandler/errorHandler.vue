<template>
    <div>
        <b-modal ref="error-model" hide-footer title="Error">
        <div class="d-block text-center">
            {{msg}}
        </div>
        <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
        <b-button class="mt-2" variant="outline-warning" block @click="toggleModal">Toggle Me</b-button>
        </b-modal>
    </div>
</template>

<script>
    export default {
        name:"errorHandler",
        data(){
            return{
                msg:""
            }
        },
        mounted(){
            this.$root.$on("errorModal",(sw,msg)=>{
                console.log("sw"+sw)
                if(sw){
                    this.msg=msg
                    this.$refs['error-model'].show()

                }else{
                    this.msg="";
                    this.$refs['error-model'].hide()
                }
            })
        }
    }
</script>

<style scoped>

</style>