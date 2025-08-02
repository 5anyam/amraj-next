'use client';

export default function HorizontalCertificatesSlider() {
  const certificates = [
    { id: 1, name: "ISO 9001:2015", icon: "/certificates/1.jpg" },
    { id: 2, name: "FDA Approved", icon: "/certificates/2.jpg"},
    { id: 3, name: "GMP Certified", icon: "/certificates/3.jpg"},
    { id: 4, name: "AYUSH Approved", icon: "/certificates/4.jpg"},
    { id: 5, name: "Organic Certified", icon: "/certificates/5.jpg" },
    { id: 6, name: "Lab Tested", icon: "/certificates/6.jpg" },
    { id: 6, name: "Lab Tested", icon: "/certificates/7.jpg" },
    { id: 6, name: "Lab Tested", icon: "/certificates/8.jpg" }

  ];

  return (
    <section className="py-6 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
            Certified Quality & Safety
          </h3>
          <p className="text-sm text-gray-600">Trusted by regulatory authorities worldwide</p>
        </div>
        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 md:space-x-6 pb-2 min-w-max md:justify-center">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="flex-shrink-0 bg-gradient-to-br from-teal-50 to-orange-50 rounded-xl p-4 border border-teal-100 hover:shadow-lg transition-all duration-300 group"
                style={{ minWidth: '120px' }}
              >
                {/* Badge */}

                {/* Icon */}
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={certificate.icon}
                    alt={certificate.name}
                    className="w-8 h-8 md:w-12 md:h-12 object-contain"
                  />
                  {/* Fallback */}
                  <div className="hidden w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-teal-500 to-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm md:text-lg font-bold">✓</span>
                  </div>
                </div>

                {/* Name */}
                {/* <h4 className="text-xs md:text-sm font-semibold text-teal-700 text-center leading-tight">
                  {certificate.name}
                </h4> */}
              </div>
            ))}
          </div>
        </div>
        {/* Scroll Hint for Mobile */}
        <div className="md:hidden text-center mt-4">
          <p className="text-xs text-gray-400">← Scroll to see all certificates →</p>
        </div>
      </div>
      {/* Custom Scrollbar Styles */}
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
