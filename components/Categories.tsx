// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchProductCategories } from '../../../../lib/woocommerceApi';
// import { Package, ShoppingBag, Star, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// // Category Type Definition
// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   parent: number;
//   description: string;
//   display: string;
//   image: {
//     id: number;
//     src: string;
//     alt: string;
//   } | null;
//   menu_order: number;
//   count: number;
//   _links: {
//     self: Array<{ href: string }>;
//     collection: Array<{ href: string }>;
//   };
// }

// const ProductCategories = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [itemsPerView, setItemsPerView] = useState(4);

//   // ✅ Fixed: Properly typed React Query with better type handling
//   const { data: categories = [], isLoading, error } = useQuery<Category[]>({
//     queryKey: ['product-categories'],
//     queryFn: async () => {
//       const result = await fetchProductCategories(12, true);
//       // Ensure we always return an array
//       return Array.isArray(result) ? result : [];
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     cacheTime: 10 * 60 * 1000, // 10 minutes
//   });

//   useEffect(() => {
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleResize = () => {
//     const width = window.innerWidth;
//     if (width < 640) setItemsPerView(1);
//     else if (width < 768) setItemsPerView(2);
//     else if (width < 1024) setItemsPerView(3);
//     else setItemsPerView(4);
//   };

//   const handleCategoryClick = (category: Category) => {
//     // Navigate to category page - adjust URL structure as per your WordPress setup
//     window.location.href = `/product-category/${category.slug}`;
//   };

//   const nextSlide = () => {
//     if (categories.length > 0) {
//       setCurrentIndex((prev) => 
//         prev + itemsPerView >= categories.length ? 0 : prev + 1
//       );
//     }
//   };

//   const prevSlide = () => {
//     if (categories.length > 0) {
//       setCurrentIndex((prev) => 
//         prev === 0 ? Math.max(0, categories.length - itemsPerView) : prev - 1
//       );
//     }
//   };

//   const goToSlide = (index: number) => {
//     setCurrentIndex(index);
//   };

//   // Auto-play functionality
//   useEffect(() => {
//     if (categories.length > 0) {
//       const interval = setInterval(nextSlide, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [itemsPerView, categories]);

//   // ✅ Loading State
//   if (isLoading) {
//     return (
//       <div className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-center items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//             <span className="ml-3 text-lg text-gray-600 font-medium">Loading categories...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Error State
//   if (error) {
//     return (
//       <div className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <span className="text-red-500 text-lg">⚠️</span>
//             </div>
//             <h2 className="text-lg font-bold text-gray-800 mb-2">Categories Not Found</h2>
//             <p className="text-sm text-gray-600">Sorry, we could not load categories. Please try again later.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Empty State
//   if (categories.length === 0) {
//     return (
//       <div className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Package className="w-6 h-6 text-blue-600" />
//             </div>
//             <h2 className="text-lg font-bold text-gray-800 mb-2">No Categories Available</h2>
//             <p className="text-sm text-gray-600">Categories will appear here once they are added.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const maxDots = Math.ceil(categories.length / itemsPerView);

//   return (
//     <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="flex justify-center items-center mb-4">
//             <div className="bg-blue-100 p-3 rounded-full mr-3">
//               <Package className="w-6 h-6 text-blue-600" />
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
//               Shop by Category
//             </h2>
//           </div>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Discover our wide range of products organized by categories. Find exactly what you're looking for!
//           </p>
//         </div>

//         {/* Carousel Container */}
//         <div className="relative">
//           {/* Main Carousel */}
//           <div className="overflow-hidden rounded-2xl">
//             <div 
//               className="flex transition-transform duration-500 ease-in-out"
//               style={{
//                 transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
//                 width: `${(categories.length / itemsPerView) * 100}%`
//               }}
//             >
//               {categories.map((category, index) => (
//                 <div
//                   key={category.id}
//                   className="px-3"
//                   style={{ width: `${100 / categories.length}%` }}
//                 >
//                   <div
//                     className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
//                     onClick={() => handleCategoryClick(category)}
//                   >
//                     <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
//                       {/* Category Image */}
//                       <div className="relative h-48 overflow-hidden">
//                         <img
//                           src={category.image?.src || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'}
//                           alt={category.image?.alt || category.name}
//                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
//                         {/* Hover Arrow */}
//                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
//                           <ArrowRight className="w-4 h-4 text-gray-700" />
//                         </div>
//                       </div>

//                       {/* Category Info */}
//                       <div className="p-6">
//                         <div className="flex items-center justify-between mb-3">
//                           <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
//                             {category.name}
//                           </h3>
//                           <div className="flex items-center text-gray-500">
//                             <ShoppingBag className="w-4 h-4 mr-1" />
//                             <span className="text-sm">{category.count}</span>
//                           </div>
//                         </div>
                        
//                         <p className="text-gray-600 text-sm mb-4">
//                           {category.description ? 
//                             category.description.substring(0, 60) + '...' : 
//                             `Explore ${category.count} amazing products`
//                           }
//                         </p>

//                         {/* Category Badge */}
//                         <div className="flex items-center justify-between">
//                           <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
//                             {category.count} Products
//                           </span>
//                           <div className="flex items-center text-yellow-500">
//                             <Star className="w-4 h-4 fill-current" />
//                             <span className="text-sm text-gray-600 ml-1">Popular</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Navigation Arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
//           >
//             <ChevronLeft className="w-6 h-6 text-gray-700" />
//           </button>
          
//           <button
//             onClick={nextSlide}
//             className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
//           >
//             <ChevronRight className="w-6 h-6 text-gray-700" />
//           </button>
//         </div>

//         {/* Dots Navigation */}
//         <div className="flex justify-center items-center mt-8 space-x-2">
//           {Array.from({ length: maxDots }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 Math.floor(currentIndex / itemsPerView) === index
//                   ? 'bg-blue-600 w-8'
//                   : 'bg-gray-300 hover:bg-gray-400'
//               }`}
//             />
//           ))}
//         </div>

//         {/* View All Button */}
//         <div className="text-center mt-12">
//           <button
//             onClick={() => window.location.href = '/shop'}
//             className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
//           >
//             <ShoppingBag className="w-5 h-5 mr-2" />
//             View All Products
//             <ArrowRight className="w-5 h-5 ml-2" />
//           </button>
//         </div>
//       </div>

//       {/* Custom CSS for smooth animations */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ProductCategories;