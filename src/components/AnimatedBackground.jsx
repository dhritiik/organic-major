import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-950">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px] animate-pulse-slow delay-1000"></div>
            <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-900/10 blur-[100px] animate-pulse-slow delay-2000"></div>
        </div>
    );
};

export default AnimatedBackground;
