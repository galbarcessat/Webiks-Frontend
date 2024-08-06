import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol/ol.css';

export function StoresMap({ locationsToDisplay, selectedCountry }) {
  const [map, setMap] = useState(null)
  const [vectorSource] = useState(new VectorSource())
  const mapElement = useRef(null)

  useEffect(() => {
    console.log('locationsToDisplay:', locationsToDisplay)
    if (!map) {
      const initialMap = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: vectorSource,
            style: new Style({
              image: new Icon({
                src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                scale: 0.3,
              }),
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      })
      setMap(initialMap)
    } else {
      updateMapLocations()
    }
  }, [map, locationsToDisplay])


  // useEffect(() => {
  //   if (map && selectedCountry) {
  //     // Fetch country boundaries and filter Starbucks locations
  //     fetch(`API_URL_FOR_COUNTRY_BOUNDARIES/${selectedCountry}`)
  //       .then(response => response.json())
  //       .then(boundaries => {
  //         const vectorSource = new VectorSource({
  //           features: new GeoJSON().readFeatures(boundaries),
  //         });
  //         map.addLayer(new VectorLayer({ source: vectorSource }));

  //         // Filter Starbucks locations based on boundaries
  //         const filteredLocations = starbucksLocations.filter(location =>
  //           turf.inside(
  //             [location.longitude, location.latitude],
  //             boundaries
  //           )
  //         );
  //         // Update map with filtered locations
  //       });
  //   }
  // }, [map, selectedCountry, starbucksLocations]);



  function updateMapLocations() {
    // Clear existing locations
    vectorSource.clear()

    // Add new features/locations
    locationsToDisplay.forEach((store) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([store.longitude, store.latitude])),
        name: store.name,
      });
      vectorSource.addFeature(feature)
    });

    if (!selectedCountry) {
      map.getView().setCenter(fromLonLat([0, 0]))
      map.getView().setZoom(2.5)
    }
    else if (locationsToDisplay.length > 0) {
      // Center map based on the first location if available - if i choose a country it will zoom to its locations
      const firstLocation = locationsToDisplay[0]
      map.getView().setCenter(fromLonLat([firstLocation.longitude, firstLocation.latitude]))
      map.getView().setZoom(9)
    }
  }

  return (
    <div className='map-container' ref={mapElement} style={{ width: '85vw', height: '100%' }}>

    </div>
  )
}
