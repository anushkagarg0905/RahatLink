import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/client';

// Custom Map Icons
const whIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const campIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapPage = () => {
    const [entities, setEntities] = useState({ warehouses: [], camps: [] });
    const [center, setCenter] = useState([19.0760, 72.8777]);

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const { data } = await api.get('/map');
            setEntities(data);
            if (data.warehouses.length > 0) {
                setCenter([data.warehouses[0].lat, data.warehouses[0].lng]);
            } else if (data.camps.length > 0) {
                setCenter([data.camps[0].lat, data.camps[0].lng]);
            }
        } catch (e) {
            console.error("Map Data Error:", e);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-white">Live Operations Map</h1>
                <p className="text-gray-400 mt-1">Real-time view of verified disaster zones and resource locations</p>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-800 shadow-xl relative z-0">
                <MapContainer center={center} zoom={11} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {entities.warehouses.map(wh => (
                        <Marker key={`wh-${wh.id}`} position={[wh.lat, wh.lng]} icon={whIcon}>
                            <Popup className="text-slate-900 font-sans">
                                <strong>Warehouse: {wh.name}</strong><br />
                                Stock Available
                            </Popup>
                        </Marker>
                    ))}

                    {entities.camps.map(camp => (
                        <React.Fragment key={`camp-${camp.id}`}>
                            <Marker position={[camp.lat, camp.lng]} icon={campIcon}>
                                <Popup className="text-slate-900 font-sans">
                                    <strong>Camp: {camp.name}</strong><br />
                                    Urgency: {camp.urgency}<br />
                                    Disaster Zone: {camp.is_disaster_zone ? 'Yes' : 'No'}
                                </Popup>
                            </Marker>
                            {camp.is_disaster_zone && (
                                <Circle
                                    center={[camp.lat, camp.lng]}
                                    radius={3000}
                                    pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.2 }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapPage;
