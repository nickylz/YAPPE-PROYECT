import React from "react";
import { Link } from "react-router-dom";
import incono from "../componentes/img/Bom.png";

const Shape = ({ className }) => <div className={`absolute ${className} z-0`} style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>;

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#d16170]" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#d16170]" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.362,2.221a1,1,0,0,0-.724,0C5.6,3.63,2.561,7.575,3.1,11.528A.752.752,0,0,0,3.85,12.25h.5A.75.75,0,0,0,5.1,11.5,5.1,5.1,0,0,1,10,6.6a.75.75,0,0,0,.75-.75V2.5a.75.75,0,0,0-.388-.665Z" />
    <path d="M16.9,8.472A.752.752,0,0,0,16.15,7.75h-.5A.75.75,0,0,0,14.9,8.5,5.1,5.1,0,0,1,10,13.4a.75.75,0,0,0-.75.75v3.35a.75.75,0,0,0,.388.665.993.993,0,0,0,.724,0c4.038-1.41,7.078-5.355,6.54-9.309Z" />
  </svg>
);

const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#d16170]" viewBox="0 0 20 20" fill="currentColor">
    <path d="M18 3a1 1 0 00-1.447-.894L8.447 6.106A1 1 0 008 7v10a1 1 0 001 1h2a1 1 0 001-1v-5.586l4.293-4.293A1 1 0 0018 7V3z" />
    <path d="M6 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V3zM3 8a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zM3 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
  </svg>
);


export default function Inicio() {
  return (
    <main className="bg-[#fff3f0] overflow-x-hidden">
      {/* ===== SECCIÓN PRINCIPAL (HERO) ===== */}
      <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center px-4 py-20 bg-[#d16170] overflow-hidden">
        <Shape className="bg-[#f5bfb2]/30 w-24 h-24 top-20 left-10 animate-pulse-slow" />
        <Shape className="bg-white/20 w-40 h-40 bottom-10 right-10 animate-spin-slow" />

        <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-center gap-10 lg:gap-16">
          <div className="max-w-lg text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight" style={{ fontFamily: 'serif' }}>
              Postres <span className="text-[#f5bfb2]">únicos</span>,
              <br />
              momentos dulces.
            </h1>
            <p className="mt-6 text-lg text-[#fff3f0] leading-relaxed opacity-95">
              En <span className="font-semibold text-white">Bom Bocado</span> creamos repostería fina con amor, ingredientes seleccionados y detalles que enamoran.
            </p>
            <Link
              to="/productos"
              className="mt-8 inline-block px-10 py-4 bg-[#ee708d] text-white font-bold text-lg rounded-full hover:bg-[#d64667] transition-transform transform hover:scale-105 shadow-lg"
            >
              Ver Postres
            </Link>
          </div>
          <div className="bg-transparent p-3">
            <img
              src={incono}
              alt="Logo de Bom Bocado"
              className="w-52 h-52 md:w-80 md:h-80 object-contain drop-shadow-xl transform hover:rotate-3 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ ELEGIRNOS ===== */}
      <section className="py-20 md:py-24 px-4">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#9c2007]" style={{ fontFamily: 'serif' }}>
                Un Bocado de Felicidad
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Los ingredientes que hacen cada postre una experiencia inolvidable.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
                <div className="bg-white p-5 rounded-full flex items-center justify-center mb-4 border-2 border-[#f5bfb2]">
                    <HeartIcon />
                </div>
                <h3 className="text-xl font-bold text-[#7a1a0a] mb-2">Hecho con Amor</h3>
                <p className="text-gray-600 leading-relaxed">Cada postre es una obra de arte, preparada con pasión y dedicación de nuestra cocina a tu mesa.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-white p-5 rounded-full flex items-center justify-center mb-4 border-2 border-[#f5bfb2]">
                     <LeafIcon />
                </div>
                <h3 className="text-xl font-bold text-[#7a1a0a] mb-2">Ingredientes Frescos</h3>
                <p className="text-gray-600 leading-relaxed">Solo usamos los ingredientes más frescos y de la más alta calidad para un sabor insuperable.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-white p-5 rounded-full flex items-center justify-center mb-4 border-2 border-[#f5bfb2]">
                    <PaletteIcon />
                </div>
                <h3 className="text-xl font-bold text-[#7a1a0a] mb-2">Diseños Creativos</h3>
                <p className="text-gray-600 leading-relaxed">Nuestros postres no solo son deliciosos, también son hermosos. Perfectos para cualquier ocasión.</p>
            </div>
        </div>
      </section>

      {/* ===== LO MÁS VENDIDO (REDiseñado) ===== */}
      <section className="relative pt-12 pb-12 md:pt-24 md:pb-24">
        <div className="absolute top-0 inset-x-0 h-full">
          <div className="h-full w-full max-w-7xl mx-auto bg-white rounded-[50px] md:rounded-[100px] shadow-xl border border-[#f5bfb2]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#9c2007]" style={{ fontFamily: 'serif' }}>
                  Postres Estrella
                </h2>
                <p className="text-sm md:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">Los postres de siempre, los que se roban todos los suspiros.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                {/* Columna 1 */}
                <div className="space-y-6">
                    <div className="bg-[#fcefee] rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-[#f5bfb2]">
                        <img src="https://i.pinimg.com/1200x/a5/75/8c/a5758c95cfd57b1c1d1292f0a0be02ec.jpg" alt="Macaloves" className="w-full h-48 sm:h-64 object-cover"/>
                        <div className="p-5 text-center">
                            <h3 className="font-semibold text-xl text-[#7a1a0a] mb-2">Macaloves</h3>
                            <Link to="/productos" className="text-[#d8718c] font-bold hover:underline text-lg">Ver más</Link>
                        </div>
                    </div>
                    <div className="bg-[#fcefee] rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-[#f5bfb2]">
                        <img src="https://i.pinimg.com/1200x/02/a1/00/02a10030eaed821b1525560b18e4b7b8.jpg" alt="Heartful Bites" className="w-full h-48 sm:h-64 object-cover"/>
                        <div className="p-5 text-center">
                            <h3 className="font-semibold text-xl text-[#7a1a0a] mb-2">Heartful Bites</h3>
                            <Link to="/productos" className="text-[#d8718c] font-bold hover:underline text-lg">Ver más</Link>
                        </div>
                    </div>
                </div>

                {/* Columna 2 (con margen superior) */}
                <div className="space-y-6 sm:mt-10">
                    <div className="bg-[#fcefee] rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-[#f5bfb2]">
                        <img src="https://i.pinimg.com/736x/d1/8f/da/d18fdaa9cd95c431e6fb77c53cda987d.jpg" alt="Strawberry Cloud Croissant" className="w-full h-48 sm:h-64 object-cover"/>
                        <div className="p-5 text-center">
                            <h3 className="font-semibold text-xl text-[#7a1a0a] mb-2">Strawberry Cloud</h3>
                            <Link to="/productos" className="text-[#d8718c] font-bold hover:underline text-lg">Ver más</Link>
                        </div>
                    </div>
                    <div className="bg-[#fcefee] rounded-3xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-[#f5bfb2]">
                        <img src="https://i.pinimg.com/736x/e0/99/63/e099634012685ea760aa16416f208467.jpg" alt="Cherry Kiss Pie" className="w-full h-48 sm:h-64 object-cover"/>
                        <div className="p-5 text-center">
                            <h3 className="font-semibold text-xl text-[#7a1a0a] mb-2">Raspberry Kiss Pie</h3>
                            <Link to="/productos" className="text-[#d8718c] font-bold hover:underline text-lg">Ver más</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </main>
  );
}
