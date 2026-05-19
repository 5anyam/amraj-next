'use client';

export default function HorizontalCertificatesSlider() {
  const certificates = [
    { id: 1, name: "ISO 9001:2015", icon: "/certificates/1.jpg" },
    { id: 2, name: "FDA Approved", icon: "/certificates/2.jpg"},
    { id: 3, name: "GMP Certified", icon: "/certificates/3.jpg"},
    { id: 4, name: "AYUSH Approved", icon: "/certificates/4.jpg"},
    { id: 5, name: "Organic Certified", icon: "/certificates/5.jpg" },
    { id: 6, name: "Lab Tested", icon: "/certificates/6.jpg" },
    { id: 7, name: "Lab Tested", icon: "/certificates/7.jpg" },
    { id: 8, name: "Lab Tested", icon: "/certificates/8.jpg" }
  ];

  return (
    <section className="py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Centered Minimal Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
           <div className="h-[1px] w-12 bg-gray-200 hidden sm:block"></div>
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-center">
             Our Certifications
           </h3>
           <div className="h-[1px] w-12 bg-gray-200 hidden sm:block"></div>
        </div>

        {/* Scroll Container */}
        <div className="relative group">
          
          {/* Fades for scroll indication (Mobile only) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 md:hidden pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 md:hidden pointer-events-none" />

          {/* Flex Container - Centered on Desktop */}
          <div className="overflow-x-auto scrollbar-hide flex gap-4 pb-2 snap-x md:justify-center">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="snap-start flex-shrink-0 flex flex-col items-center gap-2"
                title={certificate.name}
              >
                {/* Modern 'App Icon' Style Container */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-100 cursor-pointer">
                  <img
                    src={certificate.icon}
                    alt={certificate.name}
                    className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
