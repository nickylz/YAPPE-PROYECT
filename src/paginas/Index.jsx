
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// SLIDES
import slide1 from "../componentes/img/slide1.png";
import slide2 from "../componentes/img/slide2.png";
import slide3 from "../componentes/img/slide3.png";
import slide4 from "../componentes/img/slide4.png";
import slide5 from "../componentes/img/slide5.png";

// VIDEO
import video from "../componentes/img/video.mp4";

// TARJETAS
import motivo1 from "../componentes/img/motivo1.png";
import motivo2 from "../componentes/img/motivo2.png";
import motivo3 from "../componentes/img/motivo3.png";
import motivo4 from "../componentes/img/motivo4.png";
import motivo5 from "../componentes/img/motivo5.png";
import motivo6 from "../componentes/img/motivo6.png";
import motivo7 from "../componentes/img/motivo7.png";
import motivo8 from "../componentes/img/motivo8.png";

const slides = [
  {
    titulo: (
      <>
        Yape <span className="text-[#18dbc1]">Oportunidades</span>
        <br /> para Todos
      </>
    ),
    texto: "Da tu primer paso al mundo laboral con Yape.",
    imagen: slide4,
  },
  { titulo: "Tu primer paso al mundo laboral", texto: "Accede a oportunidades reales diseñadas para jóvenes.", imagen: slide1 },
  { titulo: "Un espacio para todos", texto: "Creemos en la inclusión y el talento joven.", imagen: slide3 },
  { titulo: "Aprende mientras creces", texto: "Desarrolla habilidades en un entorno innovador.", imagen: slide2 },
  { titulo: "Tu futuro empieza hoy", texto: "Atrévete a dar el primer paso.", imagen: slide5 },
];

const tarjetas = [
  { img: motivo1, titulo: "Primer empleo", desc: "Yape te da tu primera oportunidad laboral real." },
  { img: motivo2, titulo: "Aprendizaje", desc: "Aprendes habilidades digitales y financieras." },
  { img: motivo3, titulo: "Crecimiento", desc: "Puedes crecer dentro de la empresa." },
  { img: motivo4, titulo: "Ambiente joven", desc: "Trabajas con jóvenes como tú." },
  { img: motivo5, titulo: "Innovación", desc: "Formas parte de tecnología real." },
  { img: motivo6, titulo: "Flexibilidad", desc: "Ambiente moderno y dinámico." },
  { img: motivo7, titulo: "Impacto", desc: "Ayudas a millones de personas." },
  { img: motivo8, titulo: "Futuro", desc: "Construyes tu carrera desde cero." },
];

export default function Inicio() {

  const [slideIndex, setSlideIndex] = useState(0);
  const [activa, setActiva] = useState(null);
  const [muted, setMuted] = useState(true);
  const [count, setCount] = useState(0);

  const videoRef = useRef(null);
  const scrollRef = useRef(null);

  const finalNumber = 1000;
  const digits = count.toString().padStart(4, "0").split("");

  // CONTADOR
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 5;
      if (start >= finalNumber) clearInterval(interval);
      setCount(Math.min(start, finalNumber));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // SLIDES AUTO
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[slideIndex];

  const prevSlide = () => {
    setSlideIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setSlideIndex((prev) =>
      (prev + 1) % slides.length
    );
  };

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: "smooth" });
  };

  return (
    <main className="overflow-x-hidden bg-white">

      {/* SLIDER */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `url(${slide.imagen})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        {/* FLECHA IZQUIERDA */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/30 w-16 h-16 rounded-full text-white text-2xl hover:scale-110 transition"
        >
          ‹
        </button>

        {/* FLECHA DERECHA */}
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/30 w-16 h-16 rounded-full text-white text-2xl hover:scale-110 transition"
        >
          ›
        </button>

        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-6xl font-extrabold">{slide.titulo}</h1>
          <p className="mt-4 text-xl">{slide.texto}</p>

          <Link
            to="/registro"
            className="mt-6 inline-block px-10 py-4 bg-[#18dbc1] font-bold rounded-full"
          >
            Únete a nosotros
          </Link>
        </div>
      </section>

      {/* BIENVENIDA */}
      <section className="py-28 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800">
            Bienvenido a Yape
          </h2>

          <h3 className="text-3xl md:text-4xl text-[#18dbc1] mt-6 font-semibold">
            Yape: oportunidades para todos
          </h3>

          <p className="mt-8 text-xl text-gray-700 leading-relaxed">
            Descubre cómo es un día trabajando en Yape y da el primer paso hacia tu futuro laboral.
          </p>

          <p className="mt-5 text-lg text-gray-700 leading-relaxed">
            A través de este espacio podrás conocer de cerca la experiencia real dentro de nuestro equipo: jóvenes como tú aprendiendo, creciendo y construyendo oportunidades en el mundo financiero. No necesitas experiencia, solo las ganas de empezar.
          </p>

          <p className="mt-6 text-lg font-semibold text-gray-800">
            Mira el video, inspírate y comienza hoy tu camino con nosotros.
          </p>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            src={video}
            muted={muted}
            autoPlay
            loop
            controls
            onClick={toggleVideo}
            className="w-full h-[500px] object-cover rounded-3xl shadow-2xl cursor-pointer"
          />
        </div>

      </section>

      {/* CONTADOR */}
      <section className="py-16 text-center">

        <h2 className="text-4xl font-semibold text-gray-700">
          No importa de dónde vienes, importa a dónde quieres llegar
        </h2>

        <h3 className="mt-6 text-2xl font-semibold">
          Jóvenes construyendo el futuro
        </h3>

        <div className="flex justify-center gap-4 mt-6">
          {digits.map((num, i) => (
            <div key={i} className="w-16 h-20 flex items-center justify-center text-2xl font-bold border rounded-xl shadow">
              {num}
            </div>
          ))}
        </div>

        <p className="mt-3 text-gray-600">
          jóvenes ya forman parte del{" "}
          <span className="text-[#18dbc1] font-semibold">Team Yape</span>
        </p>

      </section>

      {/* CARRUSEL */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          ¿Por qué trabajar en <span className="text-[#18dbc1]">Yape</span>?
        </h2>

        <p className="text-gray-600">
          No esperes tener experiencia. Empieza ahora.
        </p>

        <Link
          to="/productos"
          className="inline-block mt-4 px-10 py-4 bg-[#18dbc1] font-bold rounded-full"
        >
          Postula ahora
        </Link>

        <div className="relative max-w-[1600px] mx-auto mt-10">

          <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 w-16 h-16 rounded-full">
            ‹
          </button>

          <div
            ref={scrollRef}
            className="flex gap-12 overflow-x-auto px-24 scroll-smooth"
          >
            {tarjetas.map((item, index) => (
              <div key={index} className="flex-shrink-0">
                <div
                  onClick={() => setActiva(index)}
                  className={`w-[520px] md:w-[600px] h-[380px] md:h-[480px] relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ${
                    activa === index ? "scale-110 z-10" : "hover:scale-105"
                  }`}
                >
                  <img src={item.img} className="w-full h-full object-cover" />

                  <div className={`absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8 transition-all duration-500 ${
                    activa === index
                      ? "bg-black/70 opacity-100"
                      : "bg-black/0 opacity-0 hover:bg-black/50 hover:opacity-100"
                  }`}>
                    <h3 className="font-bold text-4xl">{item.titulo}</h3>
                    <p className="text-xl mt-4">{item.desc}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/30 w-16 h-16 rounded-full">
            ›
          </button>

        </div>
      </section>

    </main>
  );
}