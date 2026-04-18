import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

// IMÁGENES MUJERES
import mujer1 from "../componentes/img/mujer1.png";
import mujer2 from "../componentes/img/mujer2.png";
import mujer3 from "../componentes/img/mujer3.png";
import mujer4 from "../componentes/img/mujer4.png";
import mujer5 from "../componentes/img/mujer5.png";

export default function NosotrosYape() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const scrollMujeresRef = useRef(null);

  const mujeresYape = [
    { id: 1, nombre: "Andrea Castro", rol: "Product Owner", img: mujer1, detalle: "Lidero equipos tecnológicos enfocados en crear soluciones que impactan a millones de peruanos diariamente." },
    { id: 2, nombre: "Lucía Méndez", rol: "UX Designer", img: mujer2, detalle: "Diseño experiencias inclusivas. Aquí mi voz se escucha y mis ideas se transforman en funciones reales." },
    { id: 3, nombre: "Milagros Vega", rol: "Software Engineer", img: mujer3, detalle: "Programar en Yape es un resto constante. Formo parte de una comunidad técnica increíble." },
    { id: 4, nombre: "Valeria Ríos", rol: "Data Analyst", img: mujer4, detalle: "Transformo datos en estrategias. Yape me ha permitido crecer en un ambiente de total confianza." },
    { id: 5, nombre: "Carla Espinoza", rol: "Talent Acquisition", img: mujer5, detalle: "Mi misión es encontrar el talento que mueva al país. Buscamos mujeres apasionadas." }
  ];

  const handleScroll = (direction) => {
    if (scrollMujeresRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollMujeresRef.current;
      const cardWidth = 300; 
      
      let newScroll;
      if (direction === "left") {
        newScroll = scrollLeft - cardWidth;
        if (scrollLeft <= 0) {
          newScroll = scrollWidth - clientWidth;
        }
      } else {
        newScroll = scrollLeft + cardWidth;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          newScroll = 0;
        }
      }

      scrollMujeresRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans">

      {/* HERO */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center overflow-hidden bg-[#3b0f52]">

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7e1d91] via-[#3b0f52] to-[#1a0624]" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#25d3c9] rounded-full blur-[120px] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-20 relative z-10 pt-16 pb-20">
          <div className="max-w-3xl">

            <span className="inline-block px-5 py-2 bg-[#25d3c9] text-[#3b0f52] text-sm font-black uppercase tracking-[0.2em] rounded-xl mb-8 shadow-lg">
              #TALENTOYAPE
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight italic mb-6">
              Únete a nosotros y <br />
              <span className="text-[#25d3c9]">haz que tu carrera fluya</span>
            </h1>

            <p className="text-white/90 text-xl md:text-2xl max-w-xl mb-10">
              No buscamos experiencia, buscamos talento con ganas de crecer.
            </p>

            <Link
              to="/productos"
              className="px-10 py-5 bg-[#25d3c9] text-[#3b0f52] text-xl font-black rounded-2xl hover:scale-105 transition"
            >
              ¡Postula ahora!
            </Link>

          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <div className="max-w-6xl mx-auto px-6 mb-20 mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-[#7422ff]">
          <h3 className="text-3xl font-black text-[#7422ff] uppercase mb-4">Misión</h3>
          <p className="text-gray-600 text-lg">
            Simplificar la vida de los peruanos con transacciones rápidas y seguras.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-[#00d1b2]">
          <h3 className="text-3xl font-black text-[#00d1b2] uppercase mb-4">Visión</h3>
          <p className="text-gray-600 text-lg">
            Ser la herramienta líder en inclusión financiera en el Perú.
          </p>
        </div>

      </div>

      {/* TEAM YAPE */}
      <div className="py-24 px-6 md:px-20 text-center">

        <h2 className="text-5xl font-black text-[#7422ff] mb-10">
          Conoce al <span className="text-[#00d1b2]">Team Yape</span>
        </h2>

        {/* VIDEO PRINCIPAL */}
        <div className="relative max-w-4xl mx-auto aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#7422ff]/30 mb-10">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/rEgLiaEZ0u4"
            title="Team Yape"
            allowFullScreen
          />
        </div>

        {/* VIDEOS SECUNDARIOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {[
            { id: 1, cargo: "Ximena Melchor", vid: "E-tbBfSyWwU" },
            { id: 2, cargo: "Yadira Orihuela", vid: "fOhn5eylCxQ" },
            { id: 3, cargo: "Jaime Ccanto", vid: "h8grbM4Cv18" },
          ].map((item) => (
            <div
              key={item.id}
              className="relative h-[300px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-xl group hover:scale-[1.02] transition"
            >

              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${item.vid}`}
                title={item.cargo}
                allowFullScreen
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#7422ff]/80 to-transparent flex items-end p-6">
                <p className="text-white font-black uppercase">
                  {item.cargo}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* SECCIÓN: MUJERES EN YAPE (CARRUSEL EXPANDIBLE) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 italic tracking-tighter">
            MUJERES EN <span className="text-[#18dbc1]">YAPE</span>
          </h2>
          <div className="w-20 h-1.5 bg-[#7422ff] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-12">
          <button onClick={() => handleScroll("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white text-[#7422ff] w-12 h-12 rounded-full shadow-lg hover:bg-[#7422ff] hover:text-white transition-all flex items-center justify-center text-2xl border border-gray-100">‹</button>
          <button onClick={() => handleScroll("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white text-[#7422ff] w-12 h-12 rounded-full shadow-lg hover:bg-[#7422ff] hover:text-white transition-all flex items-center justify-center text-2xl border border-gray-100">›</button>

          <div ref={scrollMujeresRef} className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar scroll-smooth px-10">
            {mujeresYape.map((mujer, index) => (
              <div
                key={mujer.id}
                className={`flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 ${expandedIndex === index ? 'w-[600px]' : 'w-[300px]'}`}
              >
                <div className="flex h-[450px]">
                  <div className="min-w-[300px] h-full relative group">
                    <img src={mujer.img} alt={mujer.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b0f52]/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 p-8 w-full">
                      <h4 className="text-white font-black text-2xl leading-tight">{mujer.nombre}</h4>
                      <p className="text-[#18dbc1] text-sm font-bold uppercase tracking-widest mt-1">{mujer.rol}</p>
                      {expandedIndex !== index && (
                        <button onClick={() => setExpandedIndex(index)} className="mt-5 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] font-black rounded-full hover:bg-[#18dbc1] hover:text-[#3b0f52] transition-all uppercase tracking-tighter">Ver más +</button>
                      )}
                    </div>
                  </div>
                  {expandedIndex === index && (
                    <div className="p-10 flex flex-col justify-center bg-white animate-slide-in-right w-full relative">
                      <button onClick={() => setExpandedIndex(null)} className="absolute top-6 right-6 text-gray-300 hover:text-[#7422ff] transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                      <h4 className="text-[#7422ff] font-black text-2xl mb-4 italic tracking-tight underline decoration-[#18dbc1] decoration-4 underline-offset-4">Su Historia</h4>
                      <p className="text-gray-500 text-lg leading-relaxed font-medium mb-6">"{mujer.detalle}"</p>
                      <div className="flex items-center gap-3"><div className="w-8 h-[2px] bg-[#18dbc1]"></div><span className="text-[#3b0f52] font-black text-xs uppercase italic">Talento Yape</span></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SWIPER CORREGIDO */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">

          <Swiper
            spaceBetween={30}
            autoplay={{ delay: 4500 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="rounded-[3rem] overflow-hidden shadow-2xl"
          >

            {/* SLIDE 1 */}
            <SwiperSlide>
              <div className="flex flex-col lg:flex-row min-h-[500px] bg-[#7e1d91]">

                <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                  <h3 className="text-4xl md:text-5xl font-black text-[#25d3c9] mb-6 italic">
                    Cero floro, puro talento
                  </h3>

                  <p className="text-white text-xl md:text-2xl mb-10">
                    Buscamos gente con ganas de crecer.
                  </p>

                  <Link
                    to="/productos"
                    className="text-white text-xl font-black underline decoration-[#25d3c9] underline-offset-8"
                  >
                    VER VACANTES →
                  </Link>
                </div>

                <div className="lg:w-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    className="w-full h-full object-cover"
                    alt="team"
                  />
                </div>

              </div>
            </SwiperSlide>

            {/* SLIDE 2 */}
            <SwiperSlide>
              <div className="flex flex-col lg:flex-row min-h-[500px] bg-[#25d3c9]">

                <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                  <h3 className="text-4xl md:text-5xl font-black text-[#3b0f52] mb-6 italic">
                    Beneficios nivel Pro
                  </h3>

                  <p className="text-[#3b0f52] text-xl md:text-2xl mb-10">
                    Crecimiento, aprendizaje y oportunidades reales.
                  </p>

                  <Link
                    to="/beneficios"
                    className="text-[#3b0f52] text-xl font-black underline decoration-white underline-offset-8"
                  >
                    CONOCE LOS BENEFICIOS →
                  </Link>
                </div>

                <div className="lg:w-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
                    className="w-full h-full object-cover"
                    alt="office"
                  />
                </div>

              </div>
            </SwiperSlide>

          </Swiper>

        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}} />

    </div>
  );
}