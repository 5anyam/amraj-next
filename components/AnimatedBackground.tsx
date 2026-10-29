'use client';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-[300px] h-[300px] bg-teal-300 opacity-30 rounded-full blur-3xl animate-blob1 top-10 left-10" />
      <div className="absolute w-[250px] h-[250px] bg-yellow-200 opacity-30 rounded-full blur-3xl animate-blob2 bottom-10 right-10" />
      <div className="absolute w-[200px] h-[200px] bg-pink-300 opacity-30 rounded-full blur-3xl animate-blob3 top-1/2 left-1/2" />
    </div>
  );
}
