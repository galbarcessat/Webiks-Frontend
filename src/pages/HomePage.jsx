import { useEffect, useState } from 'react';
import axios from 'axios';
import { booleanPointInPolygon, point } from '@turf/turf';
import { StoresMap } from "../cmps/StoresMap";
import { SearchCountry } from "../cmps/SearchCountry";
import { storeService } from '../services/stores.service.local';
import { AlertMsg } from '../cmps/AlertMsg';

export function HomePage() {
    const [stores, setStores] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [countryBoundaries, setCountryBoundaries] = useState([])
    const [storesToDisplay, setStoresToDisplay] = useState([])
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        getAllStoresLocations()
    }, [])

    useEffect(() => {
        if (!selectedCountry) {
            setStoresToDisplay(stores)
            return
        }
        getCountryStoresAndBoundaries(stores, selectedCountry.code)
        // fetchCountryBoundaries(selectedCountry.code)
    }, [selectedCountry])

    async function getAllStoresLocations() {
        try {
            const { data } = await axios.get('https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json')
            setStores(data)
            setStoresToDisplay(data)
            getAllCountryNames(data)
            openAlert({ severity: "success", text: "Fetched Starbucks store locations successfully" })

            return data
        } catch (error) {
            console.log('error:', error)
            openAlert({ severity: "error", text: "Failed to fetch Starbucks store locations" })
            throw new Error(error)
        }
    }

    function getAllCountryNames(stores) {
        const countries = storeService.getAllCountries(stores)
        setCountries(countries)
    }

    //FILTER THE STORES IN THE BACKEND
    async function getCountryStoresAndBoundaries(stores, countryCode) {
        try {
            const response = await axios.post('http://localhost:5000/filter-locations', {
                locations: stores,
                countryCode: countryCode
            });

            const { filteredLocations, countryBoundaries } = response.data
            console.log('filteredLocations:', filteredLocations)
            console.log('boundaries:', countryBoundaries)

            setCountryBoundaries(countryBoundaries)
            setStoresToDisplay(filteredLocations)
        } catch (error) {
            console.error('Error filtering locations:', error)
        }
    }

    function openAlert(alertDetails) {
        setAlert(alertDetails)
        setTimeout(() => {
            setAlert(null)
        }, 3000)
    }

    return (
        <>
            {alert && <AlertMsg alert={alert} />}
            <div className="home-page-container">
                <StoresMap
                    storesToDisplay={storesToDisplay}
                    selectedCountry={selectedCountry}
                    countryBoundaries={countryBoundaries}
                />
                <SearchCountry
                    countries={countries}
                    setSelectedCountry={setSelectedCountry}
                    selectedCountry={selectedCountry}
                    storesToDisplay={storesToDisplay}
                />
            </div>
        </>
    )
}




//FILTER LOCATIONS IN THE FRONTEND
    // function filterLocationsWithinBoundaries(locations, boundaries) {
    //     if (!locations || locations.length === 0 || !boundaries || !boundaries.type || !boundaries.coordinates) return

    //     const filteredLocations = locations.filter(location => {
    //         const locationPoint = point([location.longitude, location.latitude])
    //         return booleanPointInPolygon(locationPoint, boundaries)
    //     })

    //     console.log('filteredLocations:', filteredLocations)
    //     openAlert({ severity: "success", text: `Fetched ${selectedCountry.name} store locations successfully` })

    //     setLocationsToDisplay(filteredLocations)
    // }

    //FETCH COUNTRY BOUNADRIES IN THE FRONTEND
    // async function fetchCountryBoundaries(countryCode) {
    //     try {
    //         const { data } = await axios.get('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    //         const countryDetails = data?.features.find(country => country.properties.ISO_A2 === countryCode)

    //         if (!countryDetails) {
    //             throw new Error("Couldnt find country.")
    //         }

    //         const boundaries = {
    //             type: countryDetails.geometry.type,
    //             coordinates: countryDetails.geometry.coordinates
    //         }

    //         setCountryBoundaries(boundaries)
    //         filterLocationsWithinBoundaries(locations, boundaries)

    //     } catch (error) {
    //         console.error('Error fetching or processing country boundaries:', error);
    //         openAlert({ severity: "error", text: `Faild to fetch ${selectedCountry.name} store locations` })
    //         throw new Error(error)
    //     }
    // }


    //CHECK IF SINGLE LOCATION IS IN A CERTAIN COUNTRY CODE - BACKEND 
    // async function checkLocation(coordinates, countryCode) {
    //     try {
    //         const response = await axios.post('http://localhost:5000/check-location', {
    //             coordinates: coordinates,
    //             countryCode: countryCode
    //         });

    //         const { isInside } = response.data
    //         return isInside
    //     } catch (error) {
    //         console.error('Error checking location:', error)
    //         return false
    //     }
    // }