import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';

export function StoresMap({ storesToDisplay, selectedCountry, countryBoundaries }) {
  const [map, setMap] = useState(null)
  const [vectorSource, setVectorSource] = useState(new VectorSource())
  const [boundarySource, setBoundarySource] = useState(new VectorSource())
  const mapElement = useRef(null)

  useEffect(() => {
    if (!map) {
      const initialMap = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: boundarySource,
            style: new Style({
              stroke: new Stroke({
                color: '#ff0000',
                width: 1,
              }),
              fill: new Fill({
                color: 'rgba(255, 0, 0, 0.1)',
              }),
            }),
          }),
          new VectorLayer({
            source: vectorSource,
            style: new Style({
              image: new Icon({
                src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                scale: 0.35,
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
      updateMapStores()
      if (selectedCountry && storesToDisplay.length > 0 && countryBoundaries) {
        updateCountryBoundary()
      } else {
        boundarySource.clear() // Clear boundaries if no country is selected
      }
    }
  }, [map, storesToDisplay])

  function updateMapStores() {
    // Clear existing stores
    vectorSource.clear()
    // Add new store stores
    storesToDisplay.forEach((store) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([store.longitude, store.latitude])),
        name: store.name,
      })
      vectorSource.addFeature(feature)
    })

    if (!selectedCountry) {
      map.getView().setCenter(fromLonLat([0, 0]))
      map.getView().setZoom(2.5)
    }

  }

  function updateCountryBoundary() {
    //Clear existing boundaries/borders
    boundarySource.clear()

    //The readFeatures method converts the countryBoundaries GeoJSON data into OpenLayers features.
    const format = new GeoJSON()
    const features = format.readFeatures(countryBoundaries, {
      featureProjection: 'EPSG:3857',
    })

    boundarySource.addFeatures(features)

    // Adjust the view to fit the country boundary
    if (features.length > 0) {
      const extent = features[0].getGeometry().getExtent()
      map.getView().fit(extent, { padding: [50, 50, 50, 50] })
    }
  }

  return (
    <div className='map-container' ref={mapElement} >

    </div>
  )
}
