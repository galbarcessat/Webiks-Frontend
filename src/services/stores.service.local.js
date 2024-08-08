import axios from "axios"

export const storeService = {
    getStores,
    getAllCountries,
    filterCountryStoresAndBoundaries
}

async function getStores() {
    try {
        const { data } = await axios.get('http://localhost:3030/stores')
        return data
    } catch (error) {
        throw error
    }
}

async function filterCountryStoresAndBoundaries(countryCode) {
    try {
        //using post because i get back a big amount of data - post is better in handling big amount of data than get
        const { data } = await axios.post('http://localhost:3030/filter-stores', {
            countryCode: countryCode
        })

        const { filteredStores, countryBoundaries } = data
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

