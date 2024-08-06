import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { SOCKET_EVENT_UPDATE_BOARD, socketService } from './socket.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'storeDB'
const BASE_URL = 'store'

export const storeService = {
    query,
    getStoreById,
    save,
    remove,
   
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