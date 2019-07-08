<template>
    <div class="sysbasic-container">
        <el-tabs v-model="defaultTab" type="card">
            <el-tab-pane label="菜单管理" name="menuMana">
                <menu-mana></menu-mana>
            </el-tab-pane>
            <el-tab-pane label="权限组" name="menuRole">
                <menu-role></menu-role>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import MenuMana from "./basic/MenuMana"
import MenuRole from "./basic/MenuRole"

export default {
    name: "SysBasic",
    data() {
        return {
            defaultTab: 'menuMana'
        }
    },
    components: {
        'menu-mana': MenuMana,
        'menu-role': MenuRole
    }
}
</script>
<style lang="stylus" scoped>
    .sysbasic-container
        margin-top 10px
</style>
