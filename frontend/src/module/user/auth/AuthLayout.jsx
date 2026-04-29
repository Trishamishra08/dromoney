import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col selection:bg-[#0f1d3a]/10 overflow-hidden">
            {/* 
                Removing all fixed paddings and max-widths to allow 
                children (like Login.jsx) to be truly full-screen and edge-to-edge.
            */}
            <div className="relative w-full h-full flex flex-col">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
