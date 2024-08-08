import { StorePreview } from "./StorePreview";

export function StoreList({ stores }) {

    function sortStoresByCity(stores) {
        return stores.slice().sort((a, b) => a.city.localeCompare(b.city))
    }

    const sortedStores = sortStoresByCity(stores)

    return (
            <div className="store-list-container">
            <h2 className="all-stores-title">ALL STORES : </h2>
                <ul>
                    {sortedStores?.map(store => <StorePreview key={store.store_id} store={store} />)}
                </ul>
            </div>
    )
}

