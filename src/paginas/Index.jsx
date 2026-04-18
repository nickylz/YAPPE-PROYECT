
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

// NUEVAS IMÁGENES DEL CARRUSEL DE USO
import uso1 from "../componentes/img/uso1.png";
import uso2 from "../componentes/img/uso2.png";
import uso3 from "../componentes/img/uso3.png";
import uso4 from "../componentes/img/uso4.png";
import uso5 from "../componentes/img/uso5.png";
import uso6 from "../componentes/img/uso6.png";

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
  {
    titulo: "Tu primer paso al mundo laboral",
    texto: "Accede a oportunidades reales diseñadas para jóvenes.",
    imagen: slide1,
  },
  {
    titulo: "Un espacio para todos",
    texto: "Creemos en la inclusión y el talento joven.",
    imagen: slide3,
  },
  {
    titulo: "Aprende mientras creces",
    texto: "Desarrolla habilidades en un entorno innovador.",
    imagen: slide2,
  },
  {
    titulo: "Tu futuro empieza hoy",
    texto: "Atrévete a dar el primer paso.",
    imagen: slide5,
  },
];

const tarjetas = [
  {
    img: motivo1,
    titulo: "Primer empleo",
    desc: "Yape te da tu primera oportunidad laboral real.",
  },
  {
    img: motivo2,
    titulo: "Aprendizaje",
    desc: "Aprendes habilidades digitales y financieras.",
  },
  {
    img: motivo3,
    titulo: "Crecimiento",
    desc: "Puedes crecer dentro de la empresa.",
  },
  {
    img: motivo4,
    titulo: "Ambiente joven",
    desc: "Trabajas con jóvenes como tú.",
  },
  {
    img: motivo5,
    titulo: "Innovación",
    desc: "Formas parte de tecnología real.",
  },
  {
    img: motivo6,
    titulo: "Flexibilidad",
    desc: "Ambiente moderno y dinámico.",
  },
  {
    img: motivo7,
    titulo: "Impacto",
    desc: "Ayudas a millones de personas.",
  },
  {
    img: motivo8,
    titulo: "Futuro",
    desc: "Construyes tu carrera desde cero.",
  },
];

// NUEVO CARRUSEL DE PASOS
const pasos = [
  {
    img: uso1,
    titulo: "1. Regístrate",
    desc: "Crea tu cuenta en Yape Oportunidades de forma rápida y sencilla.",
  },
  {
    img: uso2,
    titulo: "2. Completa tu perfil",
    desc: "Agrega tus datos y cuéntanos sobre ti.",
  },
  {
    img: uso3,
    titulo: "3. Explora oportunidades",
    desc: "Descubre las vacantes disponibles para jóvenes como tú.",
  },
  {
    img: uso4,
    titulo: "4. Postula a un puesto",
    desc: "Elige la oportunidad que más te guste y envía tu solicitud.",
  },
  {
    img: uso5,
    titulo: "5. Espera nuestro contacto",
    desc: "Nuestro equipo revisará tu perfil y te llamará si avanzas.",
  },
  {
    img: uso6,
    titulo: "6. Bienvenido al Team Yape 🎉",
    desc: "Ya eres parte de la familia Yape. Empieza a crecer con nosotros.",
  },
];

export default function Inicio() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [pasoActivo, setPasoActivo] = useState(0);

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
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // SLIDER PRINCIPAL
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // CARRUSEL PASOS AUTOMÁTICO
  useEffect(() => {
    const interval = setInterval(() => {
      setPasoActivo((prev) => (prev + 1) % pasos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[slideIndex];

  const prevSlide = () =>
    setSlideIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  const nextSlide = () =>
    setSlideIndex((prev) =>
      (prev + 1) % slides.length
    );

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;

    v.paused ? v.play() : v.pause();
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -800,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 800,
      behavior: "smooth",
    });
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

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/30 rounded-full text-white text-2xl z-20"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/30 rounded-full text-white text-2xl z-20"
        >
          ›
        </button>

        <div className="relative z-10 max-w-4xl text-white">
          <h1 className="text-6xl font-extrabold">
            {slide.titulo}
          </h1>

          <p className="mt-4 text-xl">
            {slide.texto}
          </p>

          <Link
            to="/registro"
            className="mt-6 inline-block px-10 py-4 bg-[#18dbc1] font-bold rounded-full"
          >
            Únete a nosotros
          </Link>
        </div>
      </section>

      {/* BIENVENIDA */}
      <section className="py-28 px-10 max-w-[1800px] mx-auto grid md:grid-cols-2 gap-24 items-center">

        <div>
          <h2 className="text-7xl font-extrabold text-gray-800">
            Bienvenido(a) a Yape
          </h2>

          <h3 className="text-5xl text-[#18dbc1] mt-8 font-semibold">
            Yape: oportunidades para todos
          </h3>

          <p className="mt-10 text-2xl text-gray-700 leading-relaxed">
            Descubre cómo es un día trabajando en Yape y da el primer paso hacia tu futuro laboral.
          </p>

          <p className="mt-6 text-xl text-gray-700 leading-loose">
            A través de este espacio podrás conocer de cerca la experiencia real dentro de nuestro equipo:
            jóvenes como tú aprendiendo, creciendo y construyendo oportunidades en el mundo financiero.
            No necesitas experiencia, solo las ganas de empezar.
          </p>

          <p className="mt-8 text-2xl font-bold text-gray-800">
            Mira el video, inspírate y comienza hoy tu camino con nosotros.
          </p>
        </div>

        {/* VIDEO */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1000px] border-[4px] border-[#7422ff] rounded-[40px] overflow-hidden relative">
            <video
              ref={videoRef}
              src={video}
              muted
              autoPlay
              loop
              controls
              onClick={toggleVideo}
              className="w-full h-[500px] object-cover"
            />

            <div className="absolute inset-0 bg-[#7422ff]/10 pointer-events-none"></div>
          </div>
        </div>

      </section>

      {/* NUEVO CARRUSEL DINÁMICO */}
      <section className="py-32 bg-gradient-to-b from-white to-[#f7f7ff] text-center overflow-hidden">

        <h2 className="text-6xl font-extrabold text-gray-800 mb-6">
          Tu camino en Yape
        </h2>

        <p className="text-xl text-gray-600 mb-20">
          Sigue estos pasos para comenzar tu futuro laboral
        </p>

        <div className="relative h-[520px] flex justify-center items-center perspective-[1800px]">

          {pasos.map((item, index) => {
            const total = pasos.length;
            let offset = index - pasoActivo;

            if (offset < -3) offset += total;
            if (offset > 3) offset -= total;

            const translateX = offset * 320;
            const rotateY = offset * -35;
            const scale = offset === 0 ? 1 : 0.82;
            const opacity = Math.abs(offset) > 2 ? 0 : 1;

            return (
              <div
                key={index}
                onClick={() => setPasoActivo(index)}
                className="absolute w-[320px] h-[420px] cursor-pointer transition-all duration-700"
                style={{
                  transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 10 - Math.abs(offset),
                }}
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full border border-gray-200">

                  <img
                    src={item.img}
                    alt={item.titulo}
                    className="w-full h-[230px] object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#7422ff]">
                      {item.titulo}
                    </h3>

                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </section>

      {/* CONTADOR */}
      <section className="py-28 text-center bg-gradient-to-r from-[#4B1D6B] via-[#5B2C83] to-[#18dbc1]">

        <h2 className="text-5xl font-extrabold text-white">
          No importa de dónde vienes,
          <br />
          importa a dónde quieres llegar
        </h2>

        <h3 className="mt-8 text-3xl text-white/90">
          Jóvenes construyendo el futuro
        </h3>

        <div className="flex justify-center gap-6 mt-12">
          {digits.map((num, i) => (
            <div
              key={i}
              className="w-24 h-28 flex items-center justify-center text-5xl font-black bg-white/10 border border-white/40 rounded-2xl text-white"
            >
              {num}
            </div>
          ))}
        </div>

        <p className="mt-10 text-xl text-white">
          jóvenes ya forman parte del{" "}
          <span className="text-[#18dbc1] font-bold">
            Team Yape
          </span>
        </p>

      </section>

      {/* CARRUSEL ORIGINAL */}
      <section className="py-20 text-center">

        <h2 className="text-5xl font-extrabold mb-10">
          ¿Por qué trabajar en Yape?
        </h2>

        <div className="relative max-w-[1600px] mx-auto">

          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/70 rounded-full z-30"
          >
            ‹
          </button>

          <div
            ref={scrollRef}
            className="flex gap-12 overflow-x-auto px-24 scroll-smooth"
          >
            {tarjetas.map((item, index) => (
              <div key={index} className="flex-shrink-0">

                <div className="w-[650px] h-[450px] relative rounded-2xl overflow-hidden">

                  <img
                    src={item.img}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/0 hover:bg-black/50 transition">
                    <h3 className="text-3xl font-bold">
                      {item.titulo}
                    </h3>

                    <p className="mt-3">
                      {item.desc}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/70 rounded-full z-30"
          >
            ›
          </button>

        </div>

      </section>

    </main>
  );
}