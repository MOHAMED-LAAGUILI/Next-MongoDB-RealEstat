'use client';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';

// Default coordinates (New York City)
const DEFAULT_COORDS = {
  lat: 40.7128,
  lon: -74.0060,
  zoom: 13
};

const PropertyMap = ({ property }) => {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [markerText, setMarkerText] = useState('Property Location');
  const [error, setError] = useState(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        if (property?.location) {
          // Build address string with Morocco as the country
          const { street, city, state, zipcode } = property.location;
          const addressParts = [
            street,
            city,
            state,
            zipcode,
            'Morocco'  // Add country to help with geocoding
          ].filter(Boolean);
          
          const address = addressParts.join(', ');
          console.log('Geocoding address:', address);
          
          if (address) {
            // Use OpenStreetMap's Nominatim with more specific parameters
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ma&limit=1`
            );
            
            if (!response.ok) {
              console.error('Geocoding API error:', response.status, response.statusText);
              throw new Error('Geocoding failed');
            }
            
            const data = await response.json();
            console.log('Geocoding response:', data);
            
            if (data && data[0]) {
              const newCoords = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                zoom: 15
              };
              console.log('Setting coordinates to:', newCoords);
              setCoords(newCoords);
              setMarkerText(property.name || [street, city].filter(Boolean).join(', '));
              setError(null);
              return;
            }
          }
        }
        
        // If we get here, use default coordinates (now set to Morocco)
        console.log('Using default coordinates for Morocco');
        setCoords({
          lat: 33.9716,  // Default to Casablanca, Morocco
          lon: -6.8498,
          zoom: 12
        });
        setMarkerText('Default Location (Morocco)');
        setError('Could not find exact location, showing default');
      } catch (err) {
        console.error('Geocoding error:', err);
        setError('Error loading map');
        setCoords(DEFAULT_COORDS);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [property]);

  if (loading) return <Spinner loading={loading} />;

  // Generate map URL with marker
  const marker = `&marker=${coords.lat},${coords.lon},lightblue${encodeURIComponent('●')} ${encodeURIComponent(markerText)}`;
  const staticMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.01}%2C${coords.lat - 0.01}%2C${coords.lon + 0.01}%2C${coords.lat + 0.01}&layer=mapnik${marker}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=${coords.zoom}/${coords.lat}/${coords.lon}`;

  return (
    <div className="w-full h-[500px] rounded-md overflow-hidden shadow-md relative">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={staticMapUrl}
        title="Property Location"
      />
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
        <a 
          href={osmLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Larger Map
        </a>
      </div>
    </div>
  );
};

export default PropertyMap;
