import * as newApi from './api3.0'


export function getContinentsAndCountries() {
    return newApi.getSource('country')
        .then(data => {
        
            const rawCountries = data.data.map(item => {
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

            const rawIndustries = data.data.map(item => {
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

            const tags = data.data.map(item => {
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

            const titles = data.data.map(item => {
                const { id, name } = item
                return { id, titleName: name }
            })

            return titles
        })
        .catch(error => {
            console.error(error)
        })
}
