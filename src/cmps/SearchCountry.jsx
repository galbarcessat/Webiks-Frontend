import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { StoreList } from './StoreList';

export function SearchCountry({ countries, setSelectedCountry, selectedCountry, storesToDisplay }) {

    function handleCountryChange(event, countryName) {
        const selectedCountryObject = countries.find(country => country.name === countryName)
        setSelectedCountry(selectedCountryObject)
    }

    function areStoresFiltered() {
        return storesToDisplay.every(store => store.country === selectedCountry?.code)
    }

    function sortCountriesByName(countries) {
        return countries.slice().sort((a, b) => a.name.localeCompare(b.name))
    }

    const sortedCountries = sortCountriesByName(countries)

    return (
        <div className="search-country-container">
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={selectedCountry ? selectedCountry.name : null}
                onChange={handleCountryChange}
                options={sortedCountries.map(country => country.name)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Country" />}
            />

            <div className='country-details'>
                <h1>Country : <span>{selectedCountry ? selectedCountry.name : "Everywhere"}</span></h1>
                <h2>Stores : <span>{storesToDisplay.length}</span></h2>
            </div>

            {(selectedCountry && areStoresFiltered()) &&
                <StoreList
                    stores={storesToDisplay}
                />
            }

        </div>
    )
}
