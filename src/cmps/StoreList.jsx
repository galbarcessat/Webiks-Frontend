import { StorePreview } from "./StorePreview";

export function StoreList({ stores }) {
    return (
            <div className="store-list-container">
            <h2 className="all-stores-title">ALL STORES : </h2>
                <ul>
                    {stores.map(store => <StorePreview key={store.store_id} store={store} />)}
                </ul>
            </div>
    )
}

