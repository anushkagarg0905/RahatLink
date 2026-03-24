import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation2, Check } from 'lucide-react';
import api from '../api/client';

const LocationSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState(null);
    const [name, setName] = useState('');

    const role = localStorage.getItem('rahatlink_role') || 'Unknown';

    const handleDetect = () => {
        setLoading(true);
        // Simulate GPS detection
        setTimeout(() => {
            // Mock coordinates (e.g. Mumbai context)
            const lat = 19.0760 + (Math.random() - 0.5) * 0.1;
            const lng = 72.8777 + (Math.random() - 0.5) * 0.1;
            setCoords({ lat, lng });
            setLoading(false);
        }, 1500);
    };

    const handleComplete = async () => {
        if (!name || !coords) return;

        // Register dummy user for this session
        try {
            const email = `user_${Date.now()}@example.com`;
            const res = await api.post('/auth/register', {
                name: name,
                email: email,
                role: role,
                location_lat: coords.lat,
                location_lng: coords.lng
            });

            const user = res.data;
            localStorage.setItem('rahatlink_user_id', user.id);

            // Also register their respective entity
            if (role === 'Warehouse') {
                const whRes = await api.post('/warehouses/', {
                    name: `${name} Warehouse`,
                    lat: coords.lat,
                    lng: coords.lng,
                    address: "Auto-detected Location",
                    user_id: user.id
                });
                localStorage.setItem('rahatlink_entity_id', whRes.data.id);
            } else {
                const cRes = await api.post('/camps/', {
                    name: `${name} Relief Camp`,
                    lat: coords.lat,
                    lng: coords.lng,
                    is_disaster_zone: false,
                    urgency: "Medium",
                    user_id: user.id
                });
                localStorage.setItem('rahatlink_entity_id', cRes.data.id);
            }

            navigate('/dashboard');
        } catch (e) {
            console.error(e);
            alert('Error saving location data');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xl bg-panel p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Location Setup</h1>
                        <p className="text-gray-400">You are joining as: <span className="font-semibold text-gray-200">{role}</span></p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Organization Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                            placeholder="e.g. Central City Relief"
                        />
                    </div>

                    <div className="p-6 bg-background rounded-2xl border border-gray-800 text-center">
                        {coords ? (
                            <div className="text-green-400 flex flex-col items-center">
                                <Check size={48} className="mb-2" />
                                <p className="font-bold">Location Detected</p>
                                <p className="text-sm opacity-70 mt-1">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleDetect}
                                disabled={loading}
                                className="inline-flex items-center justify-center px-6 py-3 bg-panel hover:bg-gray-800 border-2 border-primary text-primary font-medium rounded-full transition cursor-pointer"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Detecting GPS...</span>
                                ) : (
                                    <>
                                        <Navigation2 size={18} className="mr-2" />
                                        Detect My Location
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <button
                        disabled={!coords || !name}
                        onClick={handleComplete}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition ${coords && name ? 'bg-primary text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(255,107,0,0.3)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        Complete Setup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationSetup;
