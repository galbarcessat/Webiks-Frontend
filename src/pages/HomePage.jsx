import { Map } from "../cmps/Map";
import { SearchStore } from "../cmps/SearchStore";

export function HomePage() {

    return (
        <div className="home-page-container">
            <Map />
            <SearchStore />
        </div>
    )
}