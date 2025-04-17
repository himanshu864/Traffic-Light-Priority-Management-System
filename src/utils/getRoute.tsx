import { ACCESS_TOKEN } from '../config';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions';

export default async function getRoute({
    coordinates,
    mapRef
} : {
    coordinates : [number,number][],
    mapRef : React.RefObject<mapboxgl.Map | null>
}) {
    if(coordinates.length < 2) return null;
    const directionsService = mbxDirections({ accessToken: ACCESS_TOKEN });
    let waypointsarray = [];
    for(let i = 0;i<coordinates.length;i++) {
        waypointsarray.push({
            coordinates : coordinates[i]
        })
    }
    const res = directionsService.getDirections({
    profile: 'driving',
    geometries: 'geojson',
    waypoints: waypointsarray
    })
    .send()
    const query = await res;
    const json = query.body;
    const data = json.routes[0];
    console.log(data);
    const geojson: GeoJSON.Feature<GeoJSON.Geometry> = {
      type: 'Feature',
      properties: {},
      geometry: data.geometry
    };
    
    if (mapRef.current!.getSource('route')) {
      // if the route already exists on the mapRef, reset it using setData
      const source : mapboxgl.GeoJSONSource | undefined = mapRef.current!.getSource('route')
      source!.setData(geojson);
    }
  
    // otherwise, add a new layer using this data
    else {
      mapRef.current?.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }