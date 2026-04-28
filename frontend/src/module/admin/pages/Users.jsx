import React, { useState, useEffect } from 'react';
import { Search, Eye, Ban, Edit2, CheckCircle, XCircle, User, Mail, Phone, Wallet, Users as UsersIcon, Calendar, ArrowRight, TrendingUp, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../../shared/services/api';

const Users = () => {
    // ── Data & States ──
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // View Drawer State
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Edit Modal State
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // ── Logic ──
    useEffect(() => {
        fetchUsers();
    }, [search, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/users?search=${search}&status=${statusFilter}`);
            if (response.success) {
                // Map backend user to UI format
                const mappedUsers = response.data.map(u => ({
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    mobile: u.phone || 'N/A',
                    referrals: u.referrals?.length || 0,
                    earnings: `₹${u.wallet?.totalEarnings || 0}`,
                    wallet: `₹${u.wallet?.balance || 0}`,
                    status: u.isBlocked ? 'Blocked' : 'Active',
                    joined: new Date(u.createdAt).toLocaleDateString(),
                    kycStatus: u.kyc?.status || 'Not Started'
                }));
                setUserList(mappedUsers);
            }
        } catch (err) {
            console.error("Fetch Users Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const toggleStatus = async (id) => {
        try {
            const response = await api.put(`/admin/users/${id}/block`);
            if (response.success) {
                fetchUsers(); // Refresh list
            }
        } catch (err) {
            console.error("Toggle Status Error:", err);
        }
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        // Implement backend edit if needed
        setIsEditModalOpen(false);
    };

    const filtered = userList; // Filtering is handled by backend search/filter query

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    // Live User Data for Drawer
    const activeUserInDrawer = userList.find(u => u.id === selectedUser?.id);

    const openDetails = (user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser({ ...user });
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-6 animate-in fade-in duration-500 relative">
            <PageHeader title="User Management" subtitle="View and manage all registered users" />

            {/* Toolbar: Search + Status Filter */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or mobile..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                    />
                </div>
                
                {/* Status Tabs */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    {['All', 'Active', 'Blocked'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all
                            ${statusFilter === status ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile</th>
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referrals</th>
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</th>
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet</th>
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-left px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentItems.length > 0 ? currentItems.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-[13px] shrink-0 shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 leading-none text-[13px] tracking-tight">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-tight">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-[13px] font-bold text-slate-600 tabular-nums">{user.mobile}</td>
                                    <td className="px-5 py-4 text-[13px] font-black text-slate-900">{user.referrals}</td>
                                    <td className="px-5 py-4 text-[13px] font-black text-emerald-600">{user.earnings}</td>
                                    <td className="px-5 py-4 text-[13px] font-black text-slate-800">{user.wallet}</td>
                                    <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openDetails(user)} title="View Detail" className="w-8 h-8 bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-500 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-sky-100/50">
                                                <Eye size={14} />
                                            </button>
                                            <button onClick={() => openEdit(user)} title="Edit User" className="w-8 h-8 bg-slate-50 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-slate-100/50">
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => toggleStatus(user.id)}
                                                title={user.status === 'Active' ? 'Block' : 'Unblock'} 
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-sm
                                                ${user.status === 'Active' ? 'bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 border-rose-100' : 'bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-500 border-emerald-100'}`}
                                            >
                                                {user.status === 'Active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                                <Search size={24} />
                                            </div>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest order-2 sm:order-1">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filtered.length)} of {filtered.length} users
                    </div>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            Prev
                        </button>
                        <div className="flex items-center gap-1.5">
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-xl text-[10px] font-black flex items-center justify-center transition-all shadow-sm ${currentPage === i + 1 ? 'bg-sky-500 text-white border-sky-400' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ── User Detail Drawer ── */}
            {isDrawerOpen && activeUserInDrawer && (
                <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
                    <div onClick={() => setIsDrawerOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
                    <div className="absolute top-0 right-0 h-full w-full max-w-[400px] bg-slate-50 shadow-2xl animate-in slide-in-from-right duration-500 ease-out flex flex-col">
                        <div className="bg-[#0F172A] p-5 text-white shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-sky-400 font-black text-xl border border-white/10 ring-2 ring-sky-500/20">
                                        {activeUserInDrawer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight">{activeUserInDrawer.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-sky-400 text-[9px] font-black uppercase tracking-widest">{activeUserInDrawer.status} Account</p>
                                            <div className={`w-1 h-1 rounded-full ${activeUserInDrawer.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400'}`}></div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/30 hover:text-white">
                                    <XCircle size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Phone size={10} className="text-sky-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Mobile</span>
                                    </div>
                                    <p className="text-[12px] font-black text-slate-700 tabular-nums">{activeUserInDrawer.mobile}</p>
                                </div>
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Calendar size={10} className="text-sky-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Joined</span>
                                    </div>
                                    <p className="text-[12px] font-black text-slate-700 tabular-nums">{activeUserInDrawer.joined || 'Jan 2024'}</p>
                                </div>
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm col-span-2">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Mail size={10} className="text-sky-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Email Address</span>
                                    </div>
                                    <p className="text-[12px] font-black text-slate-700">{activeUserInDrawer.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                        <TrendingUp size={60} />
                                    </div>
                                    <div className="flex items-center justify-between mb-2 relative z-10">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                                            <Wallet size={16} />
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Lifetime Revenue</span>
                                    </div>
                                    <h4 className="text-2xl font-black mb-0.5 tabular-nums">{activeUserInDrawer.earnings}</h4>
                                    <p className="text-emerald-100 text-[10px] font-bold">Total earnings across all tasks</p>
                                </div>

                                <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-sky-500/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                        <UsersIcon size={60} />
                                    </div>
                                    <div className="flex items-center justify-between mb-2 relative z-10">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                                            <ArrowRight size={16} />
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">User Network</span>
                                    </div>
                                    <h4 className="text-2xl font-black mb-0.5 tabular-nums">{activeUserInDrawer.referrals}</h4>
                                    <p className="text-sky-100 text-[10px] font-bold">Total direct invitations sent</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white border-t border-slate-100">
                            <button 
                                onClick={() => toggleStatus(activeUserInDrawer.id)} 
                                className={`w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg
                                ${activeUserInDrawer.status === 'Active' 
                                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white shadow-rose-100' 
                                    : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-emerald-100'}`}
                            >
                                {activeUserInDrawer.status === 'Active' ? 'Block User Account' : 'Unblock User Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit User Modal ── */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"></div>
                    <form onSubmit={handleSaveEdit} className="relative bg-white w-full max-w-[400px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-[#0F172A] p-6 text-white text-center relative">
                            <h3 className="text-lg font-black tracking-tight">Edit Profile</h3>
                            <p className="text-[10px] text-sky-400 font-black uppercase tracking-[0.2em] mt-1">ID: #{editingUser.id}</p>
                            <button title="Close" type="button" onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input 
                                            type="text"
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input 
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mobile Number</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input 
                                            type="tel"
                                            value={editingUser.mobile}
                                            onChange={(e) => setEditingUser({...editingUser, mobile: e.target.value})}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group">
                                <Save size={16} className="group-hover:scale-110 transition-transform" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Users;
