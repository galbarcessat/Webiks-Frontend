import { useEffect, useState } from 'react';
import axios from 'axios';
import { StoresMap } from "../cmps/StoresMap";
import { SearchStore } from "../cmps/SearchStore";
import { storeService } from '../services/stores.service.local';

export function HomePage() {
    const [locations, setLocations] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [locationsToDisplay, setLocationsToDisplay] = useState([])

    useEffect(() => {
        fetchStarbucksLocations()
    }, [])

    useEffect(() => {
        if (!selectedCountry) {
            setLocationsToDisplay(locations)
            return
        }
        filterLocations()
    }, [selectedCountry])

    function filterLocations() {
        const filteredLocations = locations.filter(location => location.country === selectedCountry.code)
        setLocationsToDisplay(filteredLocations)
    }

    async function fetchStarbucksLocations() {
        try {
            //later move to backend
            const { data } = await axios.get('https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json')
            console.log('locations:', data)
            setLocations(data)
            setLocationsToDisplay(data)
            getAllCountryNames(data)
            return data
        } catch (error) {
            console.log('error:', error)
            throw new Error(error)
        }
    }

    function getAllCountryNames(locations) {
        const countries = storeService.getAllCountries(locations)
        console.log('countries:', countries)
        setCountries(countries)
    }

    return (
        <div className="home-page-container">
            <StoresMap
             locationsToDisplay={locationsToDisplay} 
             selectedCountry={selectedCountry}
             />
            <SearchStore
                countries={countries}
                setSelectedCountry={setSelectedCountry}
                selectedCountry={selectedCountry}
                locationsToDisplay={locationsToDisplay} />
        </div>
    )
}