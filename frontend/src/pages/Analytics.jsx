import React, { useState, useEffect } from 'react';
import { DownloadCloud, Table2 } from 'lucide-react';
import api from '../api/client';

const Analytics = () => {
    const [allocations, setAllocations] = useState([]);

    useEffect(() => {
        fetchAllocations();
    }, []);

    const fetchAllocations = async () => {
        try {
            const { data } = await api.get('/allocations/');
            setAllocations(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleExport = () => {
        const headers = "ID,Warehouse ID,Camp ID,Item Type,Quantity,Date\n";
        const rows = allocations.map(a => `${a.id},${a.warehouse_id},${a.camp_id},${a.item_type},${a.qty},${new Date(a.created_at).toLocaleString()}`).join("\n");

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rahatlink_allocations_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Table2 className="mr-3 text-blue-500" size={32} /> Analytics Center
                    </h1>
                    <p className="text-gray-400 mt-1">Detailed view of historic distribution logs</p>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-panel border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center transition"
                >
                    <DownloadCloud size={18} className="mr-2" /> Export to CSV
                </button>
            </div>

            <div className="bg-panel border border-gray-800 rounded-2xl p-6 mt-6 overflow-hidden">
                {allocations.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                        No allocation history available yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400">
                                    <th className="pb-4 font-medium px-4">Log ID</th>
                                    <th className="pb-4 font-medium px-4">Warehouse</th>
                                    <th className="pb-4 font-medium px-4">Destination Camp</th>
                                    <th className="pb-4 font-medium px-4">Item Type</th>
                                    <th className="pb-4 font-medium text-right px-4">Quantity Dispatched</th>
                                    <th className="pb-4 font-medium text-right px-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {allocations.map(alloc => (
                                    <tr key={alloc.id} className="hover:bg-gray-800/40 transition">
                                        <td className="py-4 px-4 text-gray-500">#{alloc.id}</td>
                                        <td className="py-4 px-4 text-white">WH-{alloc.warehouse_id}</td>
                                        <td className="py-4 px-4 text-white">CAMP-{alloc.camp_id}</td>
                                        <td className="py-4 px-4 text-blue-400 font-medium">{alloc.item_type}</td>
                                        <td className="py-4 px-4 text-right font-bold text-green-500">{alloc.qty}</td>
                                        <td className="py-4 px-4 text-right text-sm text-gray-500">{new Date(alloc.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
