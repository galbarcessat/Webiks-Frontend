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

export function StoresMap({ locationsToDisplay, selectedCountry, countryBoundaries }) {
  const [map, setMap] = useState(null)
  const [vectorSource, setVectorSource] = useState(new VectorSource())
  const [boundarySource, setBoundarySource] = useState(new VectorSource());
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
      updateMapLocations()
      if (selectedCountry) {
        updateCountryBoundary()
      } else {
        boundarySource.clear() // Clear boundaries if no country is selected
      }
    }
  }, [map, locationsToDisplay])

  function updateMapLocations() {
    // Clear existing locations
    vectorSource.clear()
    // Add new store locations
    locationsToDisplay.forEach((store) => {
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
    else if (locationsToDisplay.length > 0) {
      // if i choose a country it will zoom to its locations - will go to the first one on the list
      const firstLocation = locationsToDisplay[0]
      map.getView().setCenter(fromLonLat([firstLocation.longitude, firstLocation.latitude]))
      map.getView().setZoom(9)
    }
  }

  function updateCountryBoundary() {
    // Clear existing boundaries
    boundarySource.clear();

    if (selectedCountry && countryBoundaries) {
      const format = new GeoJSON()
      const features = format.readFeatures(countryBoundaries, {
        featureProjection: 'EPSG:3857',
      });

      boundarySource.addFeatures(features);

      // Adjust the view to fit the country boundary
      if (features.length > 0) {
        const extent = features[0].getGeometry().getExtent();
        map.getView().fit(extent, { padding: [50, 50, 50, 50] });
      }
    }
  }


  return (
    <div className='map-container' ref={mapElement} style={{ width: '85vw', height: '100%' }}>

    </div>
  )
}
