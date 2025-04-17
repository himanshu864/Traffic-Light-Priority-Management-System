import { GeoJSONFeature } from "mapbox-gl";


export default function downloadArrayAsJson(arrayData : GeoJSONFeature[], filename = 'data.json') {
  
    try {
        
        if(arrayData.length == 0) {
            alert("No Path to donwload");
            return;
        }

        const targetObj = {
            "type": arrayData[0].type,
            "geometry": arrayData[0].geometry ,
            "properties": arrayData[0].properties,
        }

        const jsonString = JSON.stringify(targetObj, null, 2);
    
        const blob = new Blob([jsonString], { type: 'application/json' });
    
        const url = URL.createObjectURL(blob);
    
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.href = url;
        downloadAnchorNode.download = filename; 
        document.body.appendChild(downloadAnchorNode); 

        downloadAnchorNode.click(); 
    
        downloadAnchorNode.remove();
        URL.revokeObjectURL(url); 
  
    } catch (error) {
      console.error('Error downloading the JSON file:', error);
    }
  }
  