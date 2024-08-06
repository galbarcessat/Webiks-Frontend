import { useEffect, useState } from 'react';
import axios from 'axios';
import { StoresMap } from "../cmps/StoresMap";
import { SearchStore } from "../cmps/SearchStore";
import { storeService } from '../services/stores.service.local';

export function HomePage() {
    const [locations, setLocations] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [filteredLocations, setFilteredLocations] = useState([])

    useEffect(() => {
        fetchStarbucksLocations()
    }, [])

    async function fetchStarbucksLocations() {
        try {
            //later move to backend
            const { data } = await axios.get('https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json')
            console.log('locations:', data)
            setLocations(data)
            getAllCountryNames(data)
            return data
        } catch (error) {
            console.log('error:', error)
            throw new Error(error)
            return
        }
    }

    function getAllCountryNames(locations) {
        const countries = storeService.getAllCountries(locations)
        console.log('countries:', countries)
        setCountries(countries)
    }

    return (
        <div className="home-page-container">
            <StoresMap locations={locations} />
            <SearchStore />
        </div>
    )
}