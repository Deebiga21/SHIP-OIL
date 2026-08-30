"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Navigation } from "lucide-react";
import MaskedHeading from "@/components/MaskedHeading";

export default function LandingPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={ref} className="relative w-full bg-[#0a0a0a] text-white overflow-hidden min-h-[350vh] font-sans">
      
      {/* Watermark Background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-fixed bg-center bg-cover bg-no-repeat" 
        style={{ backgroundImage: "url('/watermark.png')" }} 
      />

      {/* Scroll Animated Line Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center">
        <LinePath scrollYProgress={scrollYProgress} className="min-w-[1200px] w-full h-auto object-cover opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-8 pb-32 flex flex-col gap-32">
        
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center text-black">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-wider">OILTRACE<span className="text-[#FACC15]">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/command-center" className="text-white">Home</Link>
            <Link href="/command-center" className="hover:text-white transition">Technology</Link>
            <Link href="/command-center" className="hover:text-white transition">Platform</Link>
            <Link href="/command-center" className="hover:text-white transition">About Us</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-12 mt-10">
          <div className="flex-1 space-y-8">
            <MaskedHeading 
              text="Protect The Oceans."
              weight={900}
              mediaType="image"
              src="/watermark.png"
              className="text-6xl md:text-9xl font-black leading-tight tracking-tighter"
            />
            <p className="text-gray-400 max-w-md text-lg">
              OILTRACE AI is a state-of-the-art intelligent marine oil spill detection and vessel attribution platform.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/command-center">
                <button className="px-8 py-4 rounded-full bg-[#FACC15] text-black font-semibold hover:scale-105 transition flex items-center gap-2">
                  Get Started
                </button>
              </Link>
              <button className="flex items-center gap-3 text-sm font-medium hover:text-[#FACC15] transition group">
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center md:justify-end">
            <div className="w-[400px] h-[500px] rounded-[40px] bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-[#2a2a2a] relative overflow-hidden flex items-center justify-center">
               <div className="absolute top-10 right-10 w-24 h-24 bg-[#FACC15]/30 rounded-full blur-2xl" />
               <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#F59E0B]/20 rounded-full blur-3xl" />
               <video 
                 autoPlay 
                 loop 
                 muted 
                 playsInline 
                 src="/ocean-video.mp4" 
                 className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
               />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="glass-panel bg-[#111111]/80 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between border border-[#222]">
          <div className="flex gap-16">
            <div>
              <p className="text-gray-500 text-sm mb-2 font-mono uppercase">Scans</p>
              <p className="text-4xl font-bold">27k+</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2 font-mono uppercase">Vessels</p>
              <p className="text-4xl font-bold">25k+</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2 font-mono uppercase">Attributions</p>
              <p className="text-4xl font-bold">12k+</p>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 flex items-center gap-6 border-l border-[#333] pl-10">
            <div>
              <p className="text-gray-500 text-sm mb-1 font-mono uppercase">Accuracy</p>
              <p className="text-2xl font-bold text-[#FACC15]">94.2%</p>
            </div>
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black" />
              <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-black" />
              <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-black" />
              <div className="w-10 h-10 rounded-full bg-[#FACC15] border-2 border-black flex items-center justify-center text-black text-xs font-bold">+</div>
            </div>
          </div>
        </section>

        {/* Features Split Section */}
        <section className="flex flex-col md:flex-row gap-12 mt-10">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="h-48 rounded-3xl bg-[#1a1a1a] border border-[#222] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="h-48 rounded-3xl bg-[#1a1a1a] border border-[#222] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="h-48 rounded-3xl bg-[#1a1a1a] border border-[#222] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="h-48 rounded-3xl bg-[#1a1a1a] border border-[#222] overflow-hidden flex items-center justify-center">
               <Navigation className="w-10 h-10 text-[#FACC15]" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <p className="text-[#FACC15] text-sm uppercase tracking-widest font-mono">Advanced Tech</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              SAR Detection <br/> & AI Hindcasting.
            </h2>
            <p className="text-gray-400">
              Sentinel-1 SAR imagery processed through a U-Net architecture for high-precision spill segmentation, paired with OpenDrift physics-aware analytics.
            </p>
            <Link href="/command-center" className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#FACC15] transition w-fit mt-4 pb-1 border-b border-[#FACC15]">
              See in action <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-32 border-t border-[#222] pt-20 flex flex-col md:flex-row justify-between items-start gap-12">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-lg">
            Stay Updated On Marine Protection AI.
          </h2>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-full bg-[#FACC15] text-black font-semibold hover:scale-105 transition">
              Subscribe Now
            </button>
          </div>
        </section>
        
      </div>
    </div>
  );
}

const LinePath = ({
  className,
  scrollYProgress,
}: {
  className: string;
  scrollYProgress: any;
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.1, 1]);

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89"
        stroke="#FACC15"
        strokeWidth="12"
        strokeLinecap="round"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};
