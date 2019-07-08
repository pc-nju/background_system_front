<template>
    <div class="main-container">
        <div class="header-container">
            <span>校区数目（{{total}}条）</span>
            <el-button size="mini" type="primary">添加</el-button>
        </div>
        <el-table
        :data="datas"
        stripe>
            
        </el-table>
    </div>
</template>
<script>
export default {
    name: "SysCamp",
    data() {
        return {
            total: 0,
            datas: [
                {name: 'xxx舞蹈室', address: '神马省神马市神马区神马街道', phone: '123456789'}
            ]
        }
    },
}
</script>
<style lang="stylus" scoped>
    .main-container
        background-color #EDEDED
        padding 20px
        margin-top 10px
        .header-container
            display flex
            justify-content space-between
</style>
