// hooks/useMarkers.ts
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import trafficimg from '../images/traffic-light.jpg'

export type MarkerRefs = Map<number, mapboxgl.Marker>;
export type CustomMarkerOptions = {
    map: mapboxgl.Map,
    coordinates: [number, number],
    sequenceNumber: number,
}

export default function useMarkers() {
  const markersRef = useRef<MarkerRefs>(new Map());

  const addMarker = ({
    map,
    coordinates,
    sequenceNumber,
  }: CustomMarkerOptions) => {
    try{
    if(markersRef.current.has(sequenceNumber)) return false;
    const element = document.createElement('img');
    element.setAttribute('src' , trafficimg);
    element.setAttribute('height' , '30');
    element.setAttribute('width' , '30');
    const marker = new mapboxgl.Marker({draggable: true, element: element});
    marker.setLngLat(coordinates);
    const popup = new mapboxgl.Popup({ offset: 25 , closeButton : true , closeOnClick : true,
      closeOnMove : true
    });
    const altitude = map.queryTerrainElevation(coordinates);
    popup.setHTML(`
        <h1>Alt: ${altitude}</h1>
        <h1>Lng: ${marker.getLngLat().lng}</h1>
        <h1>Lat: ${marker.getLngLat().lat}</h1>
        <h1>Seq: ${sequenceNumber}</h1>
    `)
    marker.setPopup(popup);
    marker.addTo(map);
    marker.on('drag',(e)=>{
        const faltitude = map.queryTerrainElevation(e.target.getLngLat());
        (e.target.getPopup())?.setHTML(`
        <h1>Alt: ${faltitude}</h1>
        <h1>Lng: ${marker.getLngLat().lng}</h1>
        <h1>Lat: ${marker.getLngLat().lat}</h1>
        <h1>Seq: ${sequenceNumber}</h1>
    `)
    })
    markersRef.current.set(sequenceNumber, marker);
  }
  catch(err) {
    alert(err);
    return false;
  }
    return true;
  };

  const removeMarker = (sequenceNumber: number) => {
    if (markersRef.current.has(sequenceNumber)) {
      const marker = markersRef.current.get(sequenceNumber);
      const marker_popup = marker?.getPopup();
      marker?.setPopup(null);
      marker_popup?.remove();
      marker?.remove();
      markersRef.current.delete(sequenceNumber);
      return true;
    }
    return false;
  };

  const editMarker = ({sequenceNumber , coordinates , map} : CustomMarkerOptions ) => {
    try {
      if(markersRef.current.has(sequenceNumber)) {
        const target_marker = markersRef.current.get(sequenceNumber);
        target_marker?.setLngLat(coordinates);
        const marker_popup = target_marker?.getPopup();
        const altitude = map.queryTerrainElevation(coordinates);
        marker_popup?.setHTML(`
          <h1>Alt: ${altitude}</h1>
          <h1>Lng: ${coordinates[0]}</h1>
          <h1>Lat: ${coordinates[1]}</h1>
          <h1>Seq: ${sequenceNumber}</h1>
      `)
        return true;
      }
      return false;
    }
    catch(err) {
      alert(err);
    }
    return false;
  }
  return { addMarker, removeMarker, markersRef, editMarker};
}
