<template>
    <div class="">
        <h2>Configuration</h2>
        <b-table hover :items="config">
            
        </b-table>
    </div>
</template>

<script>
    export default {
        name:"config",
        data(){
            return {
                config:[]
            }
        },
        mounted(){
            this.getConfig();
        },
        methods:{
            getConfig(){
                let me=this;
                this.$http.getMethod("/admin/config",{}).then((res)=>{
                    let resConfig=res.data.config;
                    for(let conf in resConfig){
                        me.config.push({key:conf,value:resConfig[conf]});
                    }
                }).catch(err=>{
                    
                })
            }
        }
    }
</script>

<style scoped>

</style>