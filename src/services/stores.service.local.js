import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import {countryCodeToName} from "../assets/countryNames.js"

const STORAGE_KEY = 'storeDB'
const BASE_URL = 'store'

export const storeService = {
    query,
    getStoreById,
    save,
    remove,
    getAllCountries
}


// Board functions
async function query() {
    return httpService.get(BASE_URL, null)
    // return await storageService.query(STORAGE_KEY)
}

async function getStoreById(storeId) {
    let stores = await query()
    let store = stores.find(store => store._id === storeId)
    // let board = await storageService.get(STORAGE_KEY, boardId)

    return store
}

async function save(store) {
    return await httpService.post(BASE_URL, store)
    // return await storageService.post(STORAGE_KEY, board)
}

async function remove(storeId) {
    return httpService.delete(`${BASE_URL}/${storeId}`, storeId)
    // return await storageService.remove(STORAGE_KEY, boardId)
}

function getAllCountries(locations) {
    const countriesCode = Array.from(new Set(locations.map(location => location.country)))
    const countryNames = countriesCode.map(code => getCountryName(code))
    return countryNames
}

function getCountryName(countryCode) {
    return countryCodeToName[countryCode] || countryCode
}