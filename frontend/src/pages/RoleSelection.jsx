import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, HandHeart } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();

    const selectRole = (role) => {
        localStorage.setItem('rahatlink_role', role);
        navigate('/location-setup');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-3 text-white">Select Your Role</h1>
                <p className="text-gray-400 max-w-md mx-auto">Please identify your organization type to proceed to the platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                <button
                    onClick={() => selectRole('Warehouse')}
                    className="group relative flex flex-col items-center justify-center p-12 bg-panel border-2 border-gray-800 rounded-3xl hover:border-primary transition-all hover:shadow-[0_0_30px_rgba(255,107,0,0.15)] hover:-translate-y-2 cursor-pointer text-left"
                >
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <PackageOpen className="text-primary" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Warehouse Manager</h2>
                    <p className="text-gray-400 text-center">Manage inventory, track stock levels, and distribute supplies to camps.</p>
                </button>

                <button
                    onClick={() => selectRole('NGO')}
                    className="group relative flex flex-col items-center justify-center p-12 bg-panel border-2 border-gray-800 rounded-3xl hover:border-blue-500 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-2 cursor-pointer text-left"
                >
                    <div className="h-24 w-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <HandHeart className="text-blue-500" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">NGO / Relief Camp</h2>
                    <p className="text-gray-400 text-center">Request supplies, report urgency, and receive allocated aid for distribution.</p>
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;
