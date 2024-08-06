
export function StorePreview({ store }) {
  return (
    <li className="store-preview">{store.city + " - " + store.name}</li>
  )
}