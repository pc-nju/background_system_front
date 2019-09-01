<template>
    <div>
        <div class="form-container">
            <el-form>
                <el-form-item label="选择校区">
                    <el-select class="input-style" size="small" v-model="campusId" placeholder="请选择校区">
                        <el-option
                        v-for="item of campuses"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择周期">
                    <el-date-picker
                    ref="weekPicker"
                    class="input-style"
                    v-model="selectedDate"
                    type="week"
                    format="yyyy 第 WW 周"
                    size="small"
                    @change="handleTimeSelected"
                    placeholder="选择周"></el-date-picker>
                </el-form-item>                                                
            </el-form>
        </div>
        <plan-show 
        :campusId="campusId + ''"
        :selectedDate="selectedTime"/>
    </div>
</template>
<script>
import PlanShow from './PlanShow'
export default {
    name: 'WeekDownload',
    data() {
        return {
            campusId: '',
            selectedDate: '',
            selectedTime: ''
        }
    },
    methods: {
        handleTimeSelected (value) {
            this.selectedTime = this.formatTime(new Date(value))
        }
    },
    props: {
        campuses: Array
    },
    components: {
        PlanShow
    }
}
</script>
<style lang="stylus" scoped>
    .form-container
        margin-top 20px
        text-align left
        .input-style
            width 50%
</style>
