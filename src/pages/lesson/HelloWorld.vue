<template>
    <div>
        <button @click="crop">截图</button>
        <img class="real-pic" :src="dataURL" v-if="preview" />
        <div class="imageWrapper" ref="imageWrapper" />
    </div>
</template>
<script>
import html2canvas from "html2canvas"

export default {
    data() {
        return {
            dataURL: '',
            preview: false
        }
    },
    methods: {
        crop () {
            // methods
            let self = this
            let ref = this.$refs.imageWrapper // 截图区域
            html2canvas(ref, {
                // backgroundColor: '#142E48'
                backgroundColor: null
            }).then((canvas) => {
                let dataURL = canvas.toDataURL("image/png")
                self.dataURL = dataURL
                // this.preview = true

                // 下载图片
                let a = document.createElement('a')
                document.body.appendChild(a)
                a.href = dataURL
                a.download = '截图'
                a.click()

            })
        }
    },
}
</script>
<style>
.real_pic {
    margin-top: 20px;
    height: 200px;
    width: 200px;
    z-index: 999;
}
.imageWrapper {
    width: 100%;
    height: 100px;
    background-color: blue;
}
</style>