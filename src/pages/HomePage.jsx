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
            const { data } = await axios.get('http://localhost:3030/stores')
            setStores(data)
            setStoresToDisplay(data)
            getAllCountryNames(data)
            openAlert({ severity: "success", text: "Fetched Starbucks store locations successfully" })

            return data
        } catch (error) {
            openAlert({ severity: "error", text: "Failed to fetch Starbucks store locations" })
            throw new Error(error)
        }
    }

    function getAllCountryNames(stores) {
        const countries = storeService.getAllCountries(stores)
        setCountries(countries)
    }

    //FILTER THE STORES IN THE BACKEND
    async function getCountryStoresAndBoundaries(countryCode) {
        try {
            const response = await axios.post('http://localhost:3030/filter-stores', {
                countryCode: countryCode
            })

            const { filteredStores, countryBoundaries } = response.data

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
