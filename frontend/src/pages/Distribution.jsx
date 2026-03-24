import React, { useState, useEffect } from 'react';
import { Send, Map } from 'lucide-react';
import api from '../api/client';

const Distribution = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        warehouse_id: '',
        camp_id: '',
        item_type: 'Food',
        qty: ''
    });

    useEffect(() => {
        fetchEntities();
    }, []);

    const fetchEntities = async () => {
        try {
            const { data } = await api.get('/map');
            setWarehouses(data.warehouses);
            setCamps(data.camps);

            if (data.warehouses.length > 0) setForm(f => ({ ...f, warehouse_id: data.warehouses[0].id }));
            if (data.camps.length > 0) setForm(f => ({ ...f, camp_id: data.camps[0].id }));
        } catch (e) {
            console.error(e);
        }
    };

    const handleAllocate = async (e) => {
        e.preventDefault();
        if (!form.qty || isNaN(form.qty) || form.qty <= 0) return;

        setLoading(true);
        try {
            await api.post('/allocations/manual', {
                warehouse_id: parseInt(form.warehouse_id),
                camp_id: parseInt(form.camp_id),
                item_type: form.item_type,
                qty: parseInt(form.qty)
            });
            alert('Supplies dispatched successfully!');
            setForm(f => ({ ...f, qty: '' }));
        } catch (e) {
            console.error(e);
            alert(e.response?.data?.detail || 'Failed to dispatch supplies. Check inventory levels.');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manual Distribution Console</h1>
                <p className="text-gray-400 mt-2">Explicitly route resources from specific warehouses to designated camps</p>
            </div>

            <div className="bg-panel border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-center mb-8 text-primary">
                    <Map size={48} className="opacity-20 absolute" />
                    <Send size={32} className="relative z-10" />
                </div>

                <form onSubmit={handleAllocate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Source Warehouse</label>
                            <select
                                value={form.warehouse_id}
                                onChange={e => setForm({ ...form, warehouse_id: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                            >
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Destination Camp</label>
                            <select
                                value={form.camp_id}
                                onChange={e => setForm({ ...form, camp_id: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                            >
                                {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Item Category</label>
                            <select
                                value={form.item_type}
                                onChange={e => setForm({ ...form, item_type: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                            >
                                <option>Food</option>
                                <option>Water</option>
                                <option>Medical Kits</option>
                                <option>Essentials</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Quantity to Dispatch</label>
                            <input
                                type="number"
                                value={form.qty}
                                onChange={e => setForm({ ...form, qty: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                                placeholder="Amount in units"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                        <button
                            type="submit"
                            disabled={loading || warehouses.length === 0 || camps.length === 0}
                            className="w-full py-4 bg-primary hover:bg-orange-600 text-white text-lg font-bold rounded-xl transition shadow-[0_0_20px_rgba(255,107,0,0.2)] disabled:opacity-50"
                        >
                            {loading ? 'Dispatching...' : 'Dispatch Supplies Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Distribution;
