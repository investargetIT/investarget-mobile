import * as newApi from './api3.0'


export function convertContinent(item) {
    const { areaCode, bucket, country, id, key, level, parent, url } = item
    return { continentName: country, id }
}

export function convertCountry(item) {
    const { areaCode, bucket, country, id, key, level, parent, url } = item
    return { areaCode, continentId: parent, countryName: country, id, url }
}

export function convertIndustry(item) {
    const { Pindustry, bucket, id, industry, isPindustry, key, url } = item
    return { bucket, id, imgUrl: url, industryName: industry, key, pIndustryId: Pindustry }
}

export function convertTag(item) {
    const { hotpoint, id, name } = item
    return { id, tagName: name }
}

export function convertTitle(item) {
    const { id, name } = item
    return { id, titleName: name }
}

export function convertOrg(item) {
    const { description, id, orgname } = item
    return { description, id, name: orgname }
}

export function convertOrgArea(item) {
    const { id, name } = item
    return { id, areaName: name }
}

export function convertUserType(groups) {
    const groupIds = groups.map(item => item.id)
    if (groupIds.includes(3)) {
        return 4 // 管理员
    } else {
        if (groupIds.includes(1) || groupIds.includes(4)) {
            return 1 // 投资人
        } else if (groupIds.includes(2) || groupIds.includes(5)) {
            return 3 // 交易师
        } else {
            // 暂时不管
        }
    }
}




export function convertUserInfo(user_info) {
    return {
        auditStatus: user_info.userstatus.id,
        cardBucket: user_info.cardBucket,
        cardKey: user_info.cardKey,
        cardUrl: user_info.cardKey ? 'https://o79atf82v.qnssl.com/' + user_info.cardKey : null,
        // 使用 org 表示 company
        company: user_info.org && convertOrg(user_info.org).name,
        country: user_info.country && convertCountry(user_info.country) ,
        // creationTime
        departMent: user_info.department,
        emailAddress: user_info.email,
        // 没用用到这个字段，暂时不管 v2: 0,1,2  v3: false, true
        // gender: user_info.gender,
        // head
        // headId
        id: user_info.id,
        // isActive
        // lastLoginTime
        // mandate
        mobile: user_info.mobile,
        mobileAreaCode: user_info.mobileAreaCode,
        name: user_info.username,
        // name_en
        org: user_info.org && convertOrg(user_info.org),
        orgArea: user_info.orgarea && convertOrgArea(user_info.orgarea),
        // partnerId
        // partnerName
        password: user_info.password,
        photoBucket: user_info.photoBucket,
        photoKey: user_info.photoKey,
        photoUrl: user_info.photourl,
        // profession
        // professionId
        // refrences
        // referencesId
        // school
        // schoolId
        // sourceofinformation
        title: user_info.title && convertTitle(user_info.title),
        token: user_info.token,
        userTags: user_info.tags && user_info.tags.map(i => convertTag(i)),
        // 暂时使用用户组转换，后面加上权限后，这里可以删除了
        userType: user_info.groups && convertUserType(user_info.groups),
        // 好像没用到
        // username: user_info.username,
        weChat: user_info.wechat,
    }
}



export function getContinentsAndCountries() {
    return newApi.getSource('country')
        .then(data => {
        
            const rawCountries = data.map(item => {
                const { areaCode, bucket, country, id, key, level, parent, url } = item
                if (level == 1) {
                    return { continentName: country, id }
                } else if (level == 2) {
                    return { areaCode, continentId: parent, countryName: country, id, url }
                }
            })
            
            const continentsAndCountries = rawCountries.filter(item => 'continentName' in item)
            continentsAndCountries.forEach(item => {
                item['countries'] = rawCountries.filter(subItem => subItem.continentId == item.id)
            })
            
            return continentsAndCountries
        })
        .catch(error => {
            console.error(error)
        })
}


export function getIndustries() {
    return newApi.getSource('industry')
        .then(data => {

            const rawIndustries = data.map(item => {
                const { Pindustry, bucket, id, industry, isPindustry, key, url } = item
                return { bucket, id, imgUrl: url, industryName: industry, key, pIndustryId: Pindustry }
            })

            const industries = rawIndustries.filter(item => item.id == item.pIndustryId)
            industries.forEach(item => {
                item['subIndustries'] = rawIndustries.filter(subItem => {
                return subItem.pIndustryId == item.id && subItem.id != item.id
                })
            })

            return industries
        })
        .catch(error => {
            console.error(error)
        })
}


export function getTags() {
    return newApi.getSource('tag')
        .then(data => {

            const tags = data.map(item => {
                const { hotpoint, id, name } = item
                return { id, tagName: name }
            })

            return tags
        })
        .catch(error => {
            console.error(error)
        })
}


export function getTitles() {
    return newApi.getSource('title')
        .then(data => {

            const titles = data.map(item => {
                const { id, name } = item
                return { id, titleName: name }
            })

            return titles
        })
        .catch(error => {
            console.error(error)
        })
}
