import { useEffect, useState } from 'react';
import axios from 'axios';
import { StoresMap } from "../cmps/StoresMap";
import { SearchCountry } from "../cmps/SearchCountry";
import { storeService } from '../services/stores.service.local';
import { booleanPointInPolygon, point } from '@turf/turf';

//handle Errors with Alert from MUI

export function HomePage() {
    const [locations, setLocations] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [countryBoundaries, setCountryBoundaries] = useState([])
    const [locationsToDisplay, setLocationsToDisplay] = useState([])

    useEffect(() => {
        getAllStoresLocations()
    }, [])

    useEffect(() => {
        if (!selectedCountry) {
            setLocationsToDisplay(locations)
            return
        }
        fetchCountryBoundaries(selectedCountry.code)
    }, [selectedCountry])

    async function getAllStoresLocations() {
        try {
            const { data } = await axios.get('https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json')
            setLocations(data)
            setLocationsToDisplay(data)
            getAllCountryNames(data)
            return data
        } catch (error) {
            console.log('error:', error)
            throw new Error(error)
        }
    }

    async function fetchCountryBoundaries(countryCode) {
        try {
            const { data } = await axios.get('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            const countryDetails = data?.features.find(country => country.properties.ISO_A2 === countryCode)

            const boundaries = {
                type: countryDetails.geometry.type,
                coordinates: countryDetails.geometry.coordinates
            }

            setCountryBoundaries(boundaries)
            // filterLocationsByName()
            filterLocationsWithinBoundaries(locations, boundaries)

        } catch (error) {
            console.error('Error fetching or processing country boundaries:', error);
        }
    }

    function filterLocationsWithinBoundaries(locations, boundaries) {
        if (!locations || locations.length === 0 || !boundaries || !boundaries.type || !boundaries.coordinates) return
        
        const filteredLocations = locations.filter(location => {
            const locationPoint = point([location.longitude, location.latitude])
            return booleanPointInPolygon(locationPoint, boundaries)
        })

        console.log('filteredLocations:', filteredLocations)
        setLocationsToDisplay(filteredLocations)
    }

    function getAllCountryNames(locations) {
        const countries = storeService.getAllCountries(locations)
        setCountries(countries)
    }

    function filterLocationsByName() {
        const filteredLocations = locations.filter(location => location.country === selectedCountry.code)
        console.log('filteredLocations:', filteredLocations)
        setLocationsToDisplay(filteredLocations)
    }

    return (
        <div className="home-page-container">
            <StoresMap
                locationsToDisplay={locationsToDisplay}
                selectedCountry={selectedCountry}
                countryBoundaries={countryBoundaries}
            />
            <SearchCountry
                countries={countries}
                setSelectedCountry={setSelectedCountry}
                selectedCountry={selectedCountry}
                locationsToDisplay={locationsToDisplay}
            />
        </div>
    )
}