
export const storeService = {
    getAllCountries
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

