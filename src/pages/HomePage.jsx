import { StoresMap } from "../cmps/StoresMap";
import { SearchStore } from "../cmps/SearchStore";

export function HomePage() {

    return (
        <div className="home-page-container">
            <StoresMap />
            <SearchStore />
        </div>
    )
}