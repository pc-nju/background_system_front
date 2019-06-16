<template>
    <div class="sysbasic-container">
        <el-tabs v-model="defaultTab" type="card">
            <el-tab-pane label="部门管理" name="depMana">
                <dep-mana></dep-mana>
            </el-tab-pane>
            <el-tab-pane label="职位管理" name="jobTitleMana">
                <jobtitle-mana></jobtitle-mana>
            </el-tab-pane>
            <el-tab-pane label="职称管理" name="posMana">
                <pos-mana></pos-mana>
            </el-tab-pane>
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
import DepMana from "./basic/DepMana"
import JobTitleMana from "./basic/JobTitleMana"
import PosMana from "./basic/PosMana"
import MenuMana from "./basic/MenuMana"
import MenuRole from "./basic/MenuRole"

export default {
    name: "SysBasic",
    data() {
        return {
            defaultTab: 'depMana'
        }
    },
    components: {
        'dep-mana': DepMana,
        'jobtitle-mana': JobTitleMana,
        'pos-mana': PosMana,
        'menu-mana': MenuMana,
        'menu-role': MenuRole
    }
}
</script>
<style lang="stylus" scoped>
    .sysbasic-container
        margin-top 10px
</style>
