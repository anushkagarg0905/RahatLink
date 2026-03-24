import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-gray-100 flex flex-col">
            <header className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-widest text-primary">RAHATLINK</h1>
                <Link to="/role-selection" className="px-5 py-2 rounded-md font-medium bg-panel hover:bg-gray-800 border border-gray-700 transition">
                    Login
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Smart Disaster Relief <br /> <span className="text-primary">Inventory Optimizer</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                        Connecting Relief, Saving Lives. Real-time verified data with AI-powered, priority-based distribution.
                    </p>

                    <div className="pt-8">
                        <Link
                            to="/role-selection"
                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary hover:bg-orange-600 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
                        >
                            Get Started
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left">
                    <div className="bg-panel p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
                        <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Verified Disaster Data</h3>
                        <p className="text-gray-400">Restricts priority resources to confirmed crisis zones preventing misuse.</p>
                    </div>
                    <div className="bg-panel p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
                        <div className="h-12 w-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                            <Globe size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Live Map Visualization</h3>
                        <p className="text-gray-400">View warehouses and camps in real-time on an interactive map with optimized routing.</p>
                    </div>
                    <div className="bg-panel p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
                        <div className="h-12 w-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Optimization</h3>
                        <p className="text-gray-400">Distance-based intelligent routing using a priority-greedy allocation algorithm.</p>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-gray-500 border-t border-gray-800 text-sm">
                <p>RahatLink Hackathon Project - AI For A Better World</p>
            </footer>
        </div>
    );
};

export default LandingPage;
