import { httpService } from "./http.service.js"

const BASE_URL = 'store'

export const storeService = {
    getStores,
    getAllCountries,
    filterCountryStoresAndBoundaries
}

async function getStores() {
    try {
        const res = await httpService.get(BASE_URL, null)
        return res
    } catch (error) {
        throw error
    }
}

async function filterCountryStoresAndBoundaries(countryCode) {
    try {
        //using post because i get back a big amount of data - post is better in handling big amount of data than get
        const res = await httpService.post(`${BASE_URL}/filter-stores`, { countryCode })
        const { filteredStores, countryBoundaries } = res
        return { filteredStores, countryBoundaries }
    } catch (error) {
        throw error
    }
}


function getAllCountries(stores) {
    const countriesCode = Array.from(new Set(stores.map(store => store.country)))

    const countryObjects = countriesCode.map(code => ({
        name: getCountryName(code),
        code: code
    }))

    return countryObjects
}

function getCountryName(countryCode) {
    const countryName = new Intl.DisplayNames(['en'], { type: 'region' })
    return countryName.of(countryCode) || countryCode
}

