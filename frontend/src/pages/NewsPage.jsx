import React, { useState, useEffect } from 'react';
import { Newspaper, ShieldCheck, ShieldAlert, Plus } from 'lucide-react';
import api from '../api/client';

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        title: '',
        location: '',
        lat: 19.0760,
        lng: 72.8777,
        is_verified: true
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data } = await api.get('/news/');
            setNews(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePostNews = async (e) => {
        e.preventDefault();
        if (!form.title || !form.location) return;

        try {
            await api.post('/news/', {
                ...form,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng)
            });
            setShowForm(false);
            setForm({ title: '', location: '', lat: 19.0760, lng: 72.8777, is_verified: true });
            fetchNews();
        } catch (e) {
            console.error(e);
            alert('Failed to post news');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Newspaper className="mr-3 text-primary" size={32} /> Disaster Feed
                    </h1>
                    <p className="text-gray-400 mt-1">Real-time verified disaster intelligence network</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-panel border border-gray-700 hover:border-primary text-white px-4 py-2 rounded-lg flex items-center transition"
                >
                    <Plus size={18} className="mr-1" /> Add Alert
                </button>
            </div>

            {showForm && (
                <div className="bg-panel border border-primary rounded-2xl p-6 shadow-xl mb-8 animate-in fade-in zoom-in-95">
                    <h2 className="text-xl font-bold text-white mb-4">Broadcast Critical Alert</h2>
                    <form onSubmit={handlePostNews} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Alert Title</label>
                                <input
                                    type="text" required
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    placeholder="e.g. Magnitude 6.5 Earthquake"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Affected Region / Camp Name</label>
                                <input
                                    type="text" required
                                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    placeholder="Matches Camps to upgrade priority"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <input
                                type="checkbox"
                                id="verified"
                                checked={form.is_verified}
                                onChange={e => setForm({ ...form, is_verified: e.target.checked })}
                                className="h-5 w-5 rounded bg-background border-gray-700 text-primary focus:ring-primary"
                            />
                            <label htmlFor="verified" className="text-white font-medium flex items-center">
                                <ShieldCheck size={18} className="mr-1 text-green-500" />
                                Mark as Confirmed (Will upgrade priority for matching camps)
                            </label>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white mr-2">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition">Publish Broadcast</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                        No alerts active on the network.
                    </div>
                ) : (
                    news.map(alert => (
                        <div key={alert.id} className="bg-panel border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                {alert.is_verified ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        <ShieldCheck size={12} className="mr-1" /> Verified Priority
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                        <ShieldAlert size={12} className="mr-1" /> Unverified
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">{new Date(alert.date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">{alert.title}</h3>
                            <p className="text-gray-400 text-sm flex-1">{alert.location}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsPage;
