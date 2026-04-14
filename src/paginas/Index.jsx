
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import slide1 from "../componentes/img/slide1.png";
import slide2 from "../componentes/img/slide2.png";
import slide3 from "../componentes/img/slide3.png";
import slide4 from "../componentes/img/slide4.png";
import slide5 from "../componentes/img/slide5.png";

const slides = [
  {
    titulo: (
      <>
        Yape <span className="text-[#fff3f0]">Oportunidades</span>
        <br />
        para Todos
      </>
    ),
    texto:
      "Da tu primer paso al mundo laboral con Yape. Descubre oportunidades reales en el sector financiero y empieza a construir tu futuro hoy.",
    imagen: slide4,
  },
  {
    titulo: "Tu primer paso al mundo laboral",
    texto:
      "Accede a oportunidades reales diseñadas para jóvenes como tú. Aprende, crece y construye tu futuro con nosotros.",
    imagen: slide1,
  },
  {
    titulo: "Un espacio para todos",
    texto:
      "En Yape creemos en la inclusión. No importa tu experiencia, aquí encuentras oportunidades para desarrollarte.",
    imagen: slide3,
  },
  {
    titulo: "Aprende mientras creces",
    texto:
      "Desarrolla habilidades clave, trabaja en equipo y adquiere experiencia en un entorno dinámico e innovador.",
    imagen: slide2,
  },
  {
    titulo: "Tu futuro empieza hoy",
    texto:
      "Atrévete a dar el primer paso. Conecta con oportunidades y forma parte del cambio en el mundo financiero.",
    imagen: slide5,
  },
];

export default function Inicio() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const slide = slides[current];

  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <section
        className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: `url(${slide.imagen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* contenido */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white">
            {slide.titulo}
          </h1>

          <p className="mt-6 text-lg text-white opacity-90">
            {slide.texto}
          </p>

          <Link
            to="/productos"
            className="mt-8 px-10 py-4 bg-[#18dbc1] text-white font-bold text-lg rounded-full hover:scale-105 transition"
          >
            Únete a nosotros
          </Link>
        </div>

        {/* indicadores */}
        <div className="absolute bottom-6 flex gap-2 z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${current === index ? "bg-white" : "bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* flecha izquierda */}
        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10
          w-12 h-12 rounded-full
          bg-white/5 backdrop-blur-xl
          border border-white/20
          text-white text-xl
          hover:bg-white/20 hover:scale-110
          transition-all duration-300"
        >
          ❮
        </button>

        {/* flecha derecha */}
        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10
          w-12 h-12 rounded-full
          bg-white/5 backdrop-blur-xl
          border border-white/20
          text-white text-xl
          hover:bg-white/20 hover:scale-110
          transition-all duration-300"
        >
          ❯
        </button>
      </section>

      {/* PRODUCTOS */}
      <section className="relative pt-12 pb-12 md:pt-24 md:pb-24">
        <div className="absolute top-0 inset-x-0 h-full">
          <div className="h-full w-full max-w-7xl mx-auto bg-white rounded-[50px] md:rounded-[100px] shadow-xl border border-[#f5bfb2]"></div>
        </div>

        
      </section>

    </main>
  );
}