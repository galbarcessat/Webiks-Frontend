import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export function SearchStore({ countries, setSelectedCountry, selectedCountry, locationsToDisplay }) {

    function handleCountryChange(event, countryName) {
        const selectedCountryObject = countries.find(country => country.name === countryName)
        console.log('selectedCountryObject:', selectedCountryObject)
        setSelectedCountry(selectedCountryObject)
    }

    return (
        <div className="search-store-container">

            <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={selectedCountry ? selectedCountry.name : null}
                onChange={handleCountryChange}
                options={countries.map(country => country.name)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Country" />}
            />

            <div className='country-details'>
                <h1>Country : <span>{selectedCountry ? selectedCountry.name : "None"}</span></h1>
                <h2>Stores :<span>{locationsToDisplay.length}</span></h2>
            </div>
        </div>
    )
}
