<template>
    <div class="">
        <div class="body-left animate__animated" :class="animateCssBuilding">
            <Box2 class="building" :animate="true">
                <div class="content">
                    <!-- https://img95.699pic.com/photo/50138/7372.jpg_wh860.jpg -->
                    <h2>地中海小区一期2号楼 </h2>
                    <el-row :gutter="20" class="ld-leader">
                        <el-col :span="8">
                            <el-avatar shape="square" :size="50"
                                       src="http://139.215.216.9:9260/2cedde49-b0fa-4719-ab25-d6c3e6c75314.png" />

                        </el-col>
                        <el-col :span="16" class="">
                            <div>楼栋长</div>
                            <div>孙家一</div>
                            <div>177xxxx2222</div>
                        </el-col>
                    </el-row>
                    <div class="describe">
                        描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容,描述内容描述内容描述内容.
                    </div>
                </div>
            </Box2>
            <Box2 :hover="false" class="Population">
                <!-- <h3>人口信息</h3> -->
                <div class="content">
                    <Population height="200px" class="chart"></Population>
                </div>
            </Box2>
            <Box2 :hover="false" class="icon-click">
                <div class="content">
                    <el-badge :value="item.num" class="item" v-for="(item, i) in btns"
                              :key="i">
                        <Btn1 :disable="!item.num" :is-active="item.active" @click="iconDetail(i)">
                            <div class="flexcenter">
                                <el-icon class="icon" size="16" style="margin-right: 2px;">
                                    <component :is="item.icon" />
                                </el-icon>
                                <text>{{ item.text }}</text>
                            </div>
                        </Btn1>
                    </el-badge>
                </div>
                <Box2 v-if="showSpecial" class="external animate__animated" :class="animateCssSpacial">
                    <el-table v-loading="loadingRoomData" element-loading-background="rgba(0, 0, 0, 0.4)" :data="_tableData"
                              :scrollbar-always-on="true" empty-text="暂无数据"
                              max-height="160"
                              :header-row-style="{ background: 'none' }"
                              :header-cell-style="{ background: 'none', color: '#50dfdb' }"
                              :row-style="{ background: 'none' }"
                              :cell-style="{ background: 'none' }">
                        <el-table-column prop="roomName" label="房间" />
                        <el-table-column prop="name" label="姓名" />
                        <el-table-column prop="sex" label="性别" />
                    </el-table>
                </Box2>
            </Box2>
        </div>
        <div class="room-temp animate__animated animate__fadeInRight" @click="$emit('reset')">
            <Box3>重置视角</Box3>
        </div>
        <div v-show="showRoom" class="room animate__animated"
             :class="animateCssRoom">
            <div class="tr">{{ clickedRoomId }}</div>
            <Box2 :animate="true">
                <div>
                    <el-table v-loading="loadingRoomData" element-loading-background="rgba(0, 0, 0, 0.4)" :data="tableData"
                              :scrollbar-always-on="true" empty-text="暂无数据"
                              max-height="200" style="width: 100%;"
                              :header-row-style="{ background: 'none' }"
                              :header-cell-style="{ background: 'none', color: '#50dfdb' }"
                              :row-style="{ background: 'none' }"
                              :cell-style="{ background: 'none' }">
                        <el-table-column prop="name" label="姓名" width="80" />
                        <el-table-column prop="sex" label="性别" width="80" />
                        <el-table-column prop="idCard" label="证件号" />
                    </el-table>
                </div>
            </Box2>
        </div>
    </div>
</template>
<script lang="ts" setup>
import 'animate.css'
import { ref, watch, reactive } from 'vue'
import Box2 from './boxes/Box2.vue'
import Box3 from './boxes/Box3.vue'
import Btn1 from './btns/Btn1.vue'
import Population from './analysis/Population.vue'
const emit = defineEmits(['changeTypeSpecial']);
const _tableData = [
    {
        name: '刘玲英',
        roomName: '1单元101',
        sex: '女',
        idCard: '220623************920'
    },
    {
        name: '刘玲英',
        roomName: '2单元302',
        sex: '女',
        idCard: '220623************920'
    },
    {
        name: '刘玲英',
        roomName: '3单元401',
        sex: '女',
        idCard: '220623************920'
    },
    {
        name: '刘玲英',
        roomName: '4单元701',
        sex: '女',
        idCard: '220623************920'
    },
]
let tableData = reactive(new Array())
const props = defineProps({
    clickedRoomId: {
        type: String,
        default: ''
    },
})
let showRoom = ref(false)
let loadingRoomData = ref(false)
let animateCssRoom = ref('animate__bounceOutRight')
let animateCssBuilding = ref('animate__fadeInLeft')
let btns = reactive([
    { id: 1, icon: 'Star', text: '残疾人', active: false },
    { id: 2, icon: 'Star', text: '低保对象', active: false },
    { id: 3, icon: 'Star', text: '需救助人员', active: false },
    { id: 4, icon: 'Cherry', text: '老年人', num: 12, active: false },
    { id: 5, icon: 'Star', text: '三无人员', active: false },
    { id: 6, icon: 'Apple', text: '志愿者', num: 2, active: false },
    { id: 7, icon: 'Star', text: '优抚对象', active: false },
    { id: 8, icon: 'Star', text: '五保户对象', active: false },
    { id: 9, icon: 'Star', text: '党员', num: 3, active: false },
    { id: 10, icon: 'Star', text: '单位', active: false },
    { id: 11, icon: 'Star', text: '社保', active: false },
])
watch(
    () => props.clickedRoomId,
    (newRoom, roldRoom) => {
        if (newRoom) {
            if (!roldRoom) {
                showRoom.value = true
                animateCssRoom.value = 'animate__fadeInDownBig'
                animateCssBuilding.value = 'animate__bounceOutLeft'
            }
            else animateCssRoom.value = 'animate__fadeInDown'
            tableData.length = 0
            loadingRoomData.value = true
            setTimeout(() => {
                animateCssRoom.value = ''
                setTimeout(() => {
                    loadingRoomData.value = false
                    tableData = reactive(new Array().concat(_tableData))
                    // console.log(tableData, _tableData)
                }, 300);
            }, 1000);
        } else {
            animateCssRoom.value = 'animate__bounceOutRight'
            animateCssBuilding.value = 'animate__bounceInLeft'
        }
    }
)
let animateCssSpacial = ref('animate__flipInX')
let showSpecial = ref(false)
let typeSpecialId = ref()
watch(
    typeSpecialId,
    (newt, oldt) => {
        newt
        showSpecial.value = true
        loadingRoomData.value = true
        // if(oldt)
        if (oldt) {
            animateCssSpacial.value = 'animate__fadeOutDown'
            setTimeout(() => {
                animateCssSpacial.value = 'animate__fadeInRight'
                setTimeout(() => {
                    animateCssSpacial.value = ''
                    loadingRoomData.value = false
                }, 1000);
            }, 500);
        } else {
            setTimeout(() => {
                animateCssSpacial.value = ''
                loadingRoomData.value = false
            }, 1000);
        }
        emit('changeTypeSpecial',typeSpecialItem)
    }
)
let typeSpecialItem:Object
function iconDetail(index: number) {
    const item = btns[index]
    if (!item.num) return
    btns.forEach(b => {
        delete b.active
    })
    item.active = true
    typeSpecialId.value = item.id
    typeSpecialItem = item
}
</script>
<style lang="scss" scoped>
.room-temp {
    position: fixed;
    right: 20px;
    top: 300px;
}

.body-left {
    display: flex;
    flex-direction: column;
    padding-top: 70px;
    height: 100%;
    box-sizing: border-box;
}

.header {
    height: 50px;
}

.building {
    width: 250px;
    margin-left: 10px;

    .content {
        padding: 10px;
    }

    h2 {
        font-size: 16px;
        margin-bottom: 15px;
        color: #50dfdb;
    }

    .ld-leader {
        margin-bottom: 15px;
    }

    .describe {
        text-indent: 2em;
    }
}

.Population {
    width: 250px;
    margin-left: 10px;
    margin-top: 15px;

    h3 {
        font-size: 14px;
        padding: 10px 0 0 15px;
        color: #0791fe;
    }

    .content {
        padding: 10px 5px;
    }
}

.icon-click {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 520px;

    .content {
        padding: 5px;
        font-size: 12px;
    }

    .buttom {
        .icon {
            border-radius: 28px;
            background: #e0e0e0;
            box-shadow: 5px 5px 10px #b5b5b5,
                -5px -5px 10px #ffffff;
        }
    }

    .external {
        position: absolute;
        right: -310px;
        bottom: 0;
        width: 300px;
    }
}


.room {
    position: fixed;
    right: 20px;
    bottom: 5%;
    width: 400px;
    color: #fff;

}

.el-table {
    background-color: transparent !important;
    color: #fff
}
</style>