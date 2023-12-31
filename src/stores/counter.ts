import {reactive} from 'vue'
import {defineStore} from 'pinia'
import type {SysDetailInfo, SysInfo} from "@/interface/sysInfo";
import type {Admin} from "@/interface/admin";

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

    let sysInfo = reactive<SysInfo>({
        ownerNickname: "",
        ownerEmailMD5: "",
        ownerProfile: "",
        runDay: 0
    })

    return {sysDetail, sysInfo}
})

export const useAdminStore = defineStore('admin', () => {

    let admin = reactive<Admin>({
        id: '',
        username: '',
        email: '',
        token: ''
    })

    return {admin}
})