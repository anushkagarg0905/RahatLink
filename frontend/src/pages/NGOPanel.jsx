import React, { useState, useEffect } from 'react';
import { FormInput, ListChecks } from 'lucide-react';
import api from '../api/client';

const NGOPanel = () => {
    const [needs, setNeeds] = useState([]);
    const [itemType, setItemType] = useState('Food');
    const [quantity, setQuantity] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [loading, setLoading] = useState(false);

    const campId = localStorage.getItem('rahatlink_entity_id') || 1;

    useEffect(() => {
        fetchNeeds();
    }, [campId]);

    const fetchNeeds = async () => {
        try {
            const { data } = await api.get(`/camps/${campId}/needs`);
            setNeeds(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePostNeed = async (e) => {
        e.preventDefault();
        if (!quantity || isNaN(quantity) || quantity <= 0) return;

        setLoading(true);
        try {
            await api.post(`/camps/${campId}/needs`, {
                item_type: itemType,
                quantity: parseInt(quantity),
                urgency: urgency
            });
            setQuantity('');
            fetchNeeds();
        } catch (e) {
            console.error(e);
            alert('Failed to post need request');
        }
        setLoading(false);
    };

    const statusColors = {
        'Pending': 'bg-gray-500/20 text-gray-400',
        'Partial': 'bg-yellow-500/20 text-yellow-500',
        'Fulfilled': 'bg-green-500/20 text-green-500'
    };

    const urgencyColors = {
        'Low': 'text-green-500',
        'Medium': 'text-yellow-500',
        'High': 'text-orange-500',
        'Critical': 'text-red-500 font-bold'
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">NGO Request Panel</h1>
                <p className="text-gray-400 mt-1">Submit resource needs and track fulfillment status</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-panel border border-gray-800 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <FormInput className="mr-2 text-blue-500" size={24} /> Request Supply
                    </h2>

                    <form onSubmit={handlePostNeed} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Item Category</label>
                            <select
                                value={itemType}
                                onChange={e => setItemType(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                            >
                                <option>Food</option>
                                <option>Water</option>
                                <option>Medical Kits</option>
                                <option>Essentials</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Quantity Required</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                placeholder="0"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Urgency Level</label>
                            <select
                                value={urgency}
                                onChange={e => setUrgency(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition disabled:opacity-50 mt-4"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-panel border border-gray-800 rounded-2xl p-6 min-h-[400px]">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <ListChecks className="mr-2 text-blue-500" size={24} /> Active Requests
                    </h2>

                    {needs.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                            No active requests. Submit one above.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400">
                                        <th className="pb-3 font-medium">Item Req</th>
                                        <th className="pb-3 font-medium">Urgency</th>
                                        <th className="pb-3 font-medium">Pending Qty</th>
                                        <th className="pb-3 font-medium text-right">Fulfillment Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {needs.map(need => (
                                        <tr key={need.id} className="hover:bg-gray-800/50 transition">
                                            <td className="py-4 font-medium text-white">{need.item_type}</td>
                                            <td className="py-4">
                                                <span className={urgencyColors[need.urgency]}>{need.urgency}</span>
                                            </td>
                                            <td className="py-4 font-medium">{need.quantity} Units</td>
                                            <td className="py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[need.status]}`}>
                                                    {need.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOPanel;
