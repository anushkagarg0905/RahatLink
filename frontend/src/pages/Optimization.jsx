import React, { useState } from 'react';
import { Cpu, Zap, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

const Optimization = () => {
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState(null);

    const handleOptimization = async () => {
        setRunning(true);
        setResults(null);
        try {
            const { data } = await api.post('/allocations/optimize');
            // Adding a faux delay to show "AI processing" effect
            setTimeout(() => {
                setResults(data.allocations);
                setRunning(false);
            }, 1500);
        } catch (e) {
            console.error(e);
            alert('Failed to run optimization algorithm');
            setRunning(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">AI Resource Optimizer</h1>
                <p className="text-gray-400 mt-2">Greedy distance algorithm with priority weighting for confirmed disaster zones</p>
            </div>

            <div className="bg-panel border border-gray-800 rounded-3xl p-10 flex flex-col items-center justify-center shadow-xl text-center">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${running ? 'bg-primary/20 scale-110 shadow-[0_0_40px_rgba(255,107,0,0.5)]' : 'bg-gray-800'}`}>
                    <Cpu size={48} className={`transition-colors ${running ? 'text-primary animate-pulse' : 'text-gray-500'}`} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                    {running ? 'Calculating optimal distribution routes...' : 'System Ready for Optimization'}
                </h2>

                <p className="text-gray-400 max-w-md mb-8">
                    The engine will evaluate all active requests, sort by Urgency + Verified Zone status, and allocate matching stock from the nearest available warehouse.
                </p>

                <button
                    onClick={handleOptimization}
                    disabled={running}
                    className="group relative flex items-center px-8 py-4 bg-primary text-white text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                    <span className="relative z-10 flex items-center">
                        <Zap className="mr-2" /> {running ? 'Processing Space-Time...' : 'Run Auto-Allocation Engine'}
                    </span>
                    <div className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-20 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                </button>
            </div>

            {results && (
                <div className="mt-8 bg-panel border border-gray-800 rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-5">
                    <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                        <CheckCircle2 className="mr-2" /> Optimization Complete
                    </h3>

                    {results.length === 0 ? (
                        <p className="text-gray-400">No new allocations could be made. Either all needs are fulfilled or warehouses lack requested items.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-500">
                                        <th className="pb-3 font-medium">Warehouse ID</th>
                                        <th className="pb-3 font-medium">Camp ID</th>
                                        <th className="pb-3 font-medium">Item Allocated</th>
                                        <th className="pb-3 font-medium text-right">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {results.map((r, i) => (
                                        <tr key={i} className="text-white hover:bg-gray-800/30">
                                            <td className="py-3 pl-2">WH-{r.warehouse_id}</td>
                                            <td className="py-3">CAMP-{r.camp_id}</td>
                                            <td className="py-3">{r.item_type}</td>
                                            <td className="py-3 text-right font-bold text-primary">{r.qty} Units</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Optimization;
