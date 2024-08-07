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
        getCountryStoresAndBoundaries(selectedCountry.code)
    }, [selectedCountry])

    async function getAllStoresLocations() {
        try {
            const allStores = await storeService.getStores()
            setStores(allStores)
            setStoresToDisplay(allStores)
            getAllCountryNames(allStores)
            openAlert({ severity: "success", text: "Fetched Starbucks store locations successfully" })

            return allStores
        } catch (error) {
            openAlert({ severity: "error", text: "Failed to fetch Starbucks store locations" })
            return
        }
    }

    function getAllCountryNames(stores) {
        const countries = storeService.getAllCountries(stores)
        setCountries(countries)
    }

    //FILTER THE STORES IN THE BACKEND AND GET COUNTRY BOUNDARIES
    async function getCountryStoresAndBoundaries(countryCode) {
        try {
            const { filteredStores, countryBoundaries } = await storeService.filterCountryStoresAndBoundaries(countryCode)

            setCountryBoundaries(countryBoundaries)
            setStoresToDisplay(filteredStores)
            openAlert({ severity: "success", text: `Fetched ${selectedCountry.name} store locations successfully` })

        } catch (error) {
            console.error('Error filtering stores:', error)
            openAlert({ severity: "error", text: `Faild to fetche ${selectedCountry.name} store locations` })
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
