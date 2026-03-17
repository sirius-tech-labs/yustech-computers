
import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
            <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-[2rem] mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="space-y-3 flex-grow">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div className="pt-4 flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded-full w-1/3" />
                    <div className="h-10 w-10 bg-gray-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export const CategoryCarouselSkeleton: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded-xl w-48" />
                    <div className="h-2 bg-tech-blue/20 rounded-full w-20" />
                </div>
            </div>
            <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-shrink-0 w-[300px] md:w-[350px]">
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SidebarSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-6" />
            {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                    <div className="space-y-2 flex-grow">
                        <div className="h-3 bg-gray-200 rounded-full w-full" />
                        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};
