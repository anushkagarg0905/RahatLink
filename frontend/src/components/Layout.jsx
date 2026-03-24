import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Map, LayoutDashboard, Package, ShieldAlert, TrendingUp, HandHeart, CheckCircle, Navigation } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const hiddenPaths = ['/', '/role-selection', '/location-setup'];
    const showSidebar = !hiddenPaths.includes(location.pathname);

    if (!showSidebar) {
        return <Outlet />;
    }

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Map View', path: '/map', icon: <Map size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <TrendingUp size={20} /> },
        { name: 'News', path: '/news', icon: <ShieldAlert size={20} /> },
        { name: 'Warehouse Panel', path: '/warehouse/panel', icon: <Package size={20} /> },
        { name: 'NGO Panel', path: '/ngo/panel', icon: <HandHeart size={20} /> },
        { name: 'Distribution', path: '/distribution', icon: <Navigation size={20} /> },
        { name: 'Optimization', path: '/optimization', icon: <Activity size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-background text-gray-100">
            <aside className="w-64 bg-panel border-r border-gray-800 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-wider text-primary">RahatLink</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const active = location.pathname.startsWith(link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'}`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-panel border-b border-gray-800 flex items-center px-6 md:hidden">
                    <h1 className="text-xl font-bold text-primary">RahatLink</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
