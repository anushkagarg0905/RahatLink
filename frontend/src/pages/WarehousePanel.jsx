import React, { useState, useEffect } from 'react';
import { PlusCircle, Package } from 'lucide-react';
import api from '../api/client';

const WarehousePanel = () => {
    const [inventory, setInventory] = useState([]);
    const [itemType, setItemType] = useState('Food');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);

    // Retrieve user ID and entity ID from local storage securely
    const whId = localStorage.getItem('rahatlink_entity_id') || 1;

    useEffect(() => {
        fetchInventory();
    }, [whId]);

    const fetchInventory = async () => {
        try {
            const { data } = await api.get(`/warehouses/${whId}/inventory`);
            setInventory(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        if (!quantity || isNaN(quantity) || quantity <= 0) return;

        setLoading(true);
        try {
            await api.post(`/warehouses/${whId}/inventory`, {
                item_type: itemType,
                quantity: parseInt(quantity)
            });
            setQuantity('');
            fetchInventory();
        } catch (e) {
            console.error(e);
            alert('Failed to update stock');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Warehouse Panel</h1>
                <p className="text-gray-400 mt-1">Manage outbound inventory and track storage levels</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-panel border border-gray-800 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <PlusCircle className="mr-2 text-primary" size={24} /> Add Stock
                    </h2>

                    <form onSubmit={handleAddStock} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Item Type</label>
                            <select
                                value={itemType}
                                onChange={e => setItemType(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                            >
                                <option>Food</option>
                                <option>Water</option>
                                <option>Medical Kits</option>
                                <option>Essentials</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Quantity (Units)</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                                placeholder="0"
                                min="1"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50"
                        >
                            Update Inventory
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-panel border border-gray-800 rounded-2xl p-6 min-h-[400px]">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Package className="mr-2 text-primary" size={24} /> Current Inventory
                    </h2>

                    {inventory.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                            No inventory recorded yet. Add stock to begin.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400">
                                        <th className="pb-3 font-medium">Item Type</th>
                                        <th className="pb-3 font-medium">Quantity Available</th>
                                        <th className="pb-3 font-medium text-right">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {inventory.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-800/50 transition">
                                            <td className="py-4 font-medium text-white">{item.item_type}</td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full font-bold">
                                                    {item.quantity} Units
                                                </span>
                                            </td>
                                            <td className="py-4 text-right text-sm text-gray-500">
                                                {new Date(item.updated_at).toLocaleString()}
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

export default WarehousePanel;
