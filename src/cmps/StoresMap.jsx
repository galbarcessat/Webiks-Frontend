
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';
import * as turf from '@turf/turf';
import { storeService } from '../services/stores.service.local';

export function StoresMap() {
  const [map, setMap] = useState(null)
  const [vectorSource, setVectorSource] = useState(new VectorSource())
  const mapElement = useRef()
  const [locations, setLocations] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetchStarbucksLocations()
  }, [])


  async function fetchStarbucksLocations() {
    //later move to backend
    try {
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
    <div>

    </div>
  )
}
