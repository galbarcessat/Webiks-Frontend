import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol/ol.css';

export function StoresMap({ locations }) {
  const [map, setMap] = useState(null)
  const [vectorSource] = useState(new VectorSource())
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
  }, [map, locations])

  function updateMapLocations() {
    // Clear existing locations
    vectorSource.clear()

    // Add new features/locations
    locations.forEach((store) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([store.longitude, store.latitude])),
        name: store.name,
      });
      vectorSource.addFeature(feature)
    });

    // Center map based on the first location if available - if i choose a country it will zoom to its locations
    if (locations.length > 0) {
      const firstLocation = locations[0]
      map.getView().setCenter(fromLonLat([firstLocation.longitude, firstLocation.latitude]))
      map.getView().setZoom(10)
    }
  }

  return (
    <div ref={mapElement} style={{ width: '85vw', height: '100vh' }}>

    </div>
  )
}
