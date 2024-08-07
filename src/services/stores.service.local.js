import { countryCodeToName } from "../assets/data/countryNames.js"

export const storeService = {
    getAllCountries
}

function getAllCountries(locations) {
    const countriesCode = Array.from(new Set(locations.map(location => location.country)))

    const countryObjects = countriesCode.map(code => ({
        name: getCountryName(code),
        code: code
    }))

    return countryObjects
}

function getCountryName(countryCode) {
    return countryCodeToName[countryCode] || countryCode
}

