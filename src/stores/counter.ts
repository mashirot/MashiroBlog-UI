import {reactive} from 'vue'
import {defineStore} from 'pinia'
import type {SysDetailInfo} from "@/interface/sysInfo";

export const useSysInfoStore = defineStore('counter', () => {

    let sysDetail = reactive<SysDetailInfo>({
        ownerNickname: "",
        ownerEmail: "",
        ownerProfile: "",
        articleCount: 0,
        commentCount: 0,
        unReviewCommentCount: 0,
        categoryCount: 0,
        tagCount: 0,
        runDay: 0
    });

    return {sysDetail}
})
