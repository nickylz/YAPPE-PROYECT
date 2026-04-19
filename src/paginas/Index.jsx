import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* IMAGES */
import slide1 from "../componentes/img/slide1.png";
import slide2 from "../componentes/img/slide2.png";
import slide3 from "../componentes/img/slide3.png";
import slide4 from "../componentes/img/slide4.png";
import slide5 from "../componentes/img/slide5.png";

import video from "../componentes/img/video.mp4";

/* PASOS */
import uso1 from "../componentes/img/uso1.png";
import uso2 from "../componentes/img/uso2.png";
import uso3 from "../componentes/img/uso3.png";
import uso4 from "../componentes/img/uso4.png";
import uso5 from "../componentes/img/uso5.png";
import uso6 from "../componentes/img/uso6.png";

/* TARJETAS */
import motivo1 from "../componentes/img/motivo1.png";
import motivo2 from "../componentes/img/motivo2.png";
import motivo3 from "../componentes/img/motivo3.png";
import motivo4 from "../componentes/img/motivo4.png";
import motivo5 from "../componentes/img/motivo5.png";
import motivo6 from "../componentes/img/motivo6.png";
import motivo7 from "../componentes/img/motivo7.png";
import motivo8 from "../componentes/img/motivo8.png";

/* ================= DATA ================= */

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
const pasos = [
  { img: uso1, titulo: "1.Regístrate", desc: "Crea tu cuenta en Yape Oportunidades de forma rápida y sencilla." },
  { img: uso2, titulo: "2.Completa tu perfil", desc: "Agrega tus datos y cuéntanos sobre ti." },
  { img: uso3, titulo: "3.Explora oportunidades", desc: "Descubre las vacantes disponibles para jóvenes como tú." },
  { img: uso4, titulo: "4.Postula", desc: "Aplica fácil,elige la oportunidad que más te guste y envía tu solicitud." },
  { img: uso5, titulo: " 5. Espera nuestro contacto", desc: "Nuestro equipo revisará tu perfil y te llamará si avanzas." },
  { img: uso6, titulo: "Bienvenido al Team Yape 🎉", desc: " Ya eres parte de la familia Yape. Empieza a crecer con nosotros." },
];


const tarjetas = [
  { img: motivo1, titulo: "Primer empleo", desc: "Tu primera oportunidad laboral." },
  { img: motivo2, titulo: "Aprendizaje", desc: "Aprendes habilidades digitales." },
  { img: motivo3, titulo: "Crecimiento", desc: "Crecimiento profesional." },
  { img: motivo4, titulo: "Ambiente joven", desc: "Equipo joven." },
  { img: motivo5, titulo: "Innovación", desc: "Tecnología real." },
  { img: motivo6, titulo: "Flexibilidad", desc: "Trabajo dinámico." },
  { img: motivo7, titulo: "Impacto", desc: "Impacto real." },
  { img: motivo8, titulo: "Futuro", desc: "Construye tu futuro." },
];

export default function Inicio() {

  /* ================= SLIDER ================= */
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[slideIndex];

  /* ================= CONTADOR ================= */
  const [count, setCount] = useState(0);
  const finalNumber = 1000;

  const digits = count.toString().padStart(4, "0").split("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 5;
      if (i >= finalNumber) clearInterval(t);
      setCount(Math.min(i, finalNumber));
    }, 25);
    return () => clearInterval(t);
  }, []);

  /* ================= CARRUSEL 3D ================= */
  const [pasoActivo, setPasoActivo] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPasoActivo((p) => (p + 1) % pasos.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  /* ================= CARRUSEL TARJETAS ================= */
  const [carIndex, setCarIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCarIndex((p) => (p + 1) % Math.ceil(tarjetas.length / 3));
    }, 4000);
    return () => clearInterval(t);
  }, []);
  const videoRef = useRef(null);

  return (
    <main className="overflow-x-hidden bg-white">

     {/* ================= SLIDER ================= */}
<section
  className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center px-6"
  style={{
    backgroundImage: `url(${slide.imagen})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute inset-0 bg-black/60" />

  <button
    onClick={() =>
      setSlideIndex((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      )
    }
    className="absolute left-2 md:left-6 z-20 text-white text-3xl md:text-5xl bg-black/40 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 transition"
  >
    ‹
  </button>

  <button
    onClick={() =>
      setSlideIndex((prev) => (prev + 1) % slides.length)
    }
    className="absolute right-2 md:right-6 z-20 text-white text-3xl md:text-5xl bg-black/40 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 transition"
  >
    ›
  </button>

  <div className="z-10 text-white max-w-4xl">
    <h1 className="text-3xl md:text-6xl font-bold leading-tight">{slide.titulo}</h1>
    <p className="mt-4 text-lg md:text-xl px-4">{slide.texto}</p>

    <Link
      to="/unete"
      className="mt-6 inline-block bg-[#18dbc1] px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-gray-900 transition hover:bg-white"
    >
      Únete
    </Link>
  </div>
</section>

      {/* ================= BIENVENIDA (AJUSTE DE VIDEO HORIZONTAL CON BLUR) ================= */}
      <section className="py-16 md:py-28 px-6 md:px-10 max-w-[1600px] mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center relative">
        
        {/* Blur Morado de fondo */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#7422ff] rounded-full blur-[120px] opacity-10 -z-10" />

        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800">
            Bienvenido(a) a Yape
          </h2>

          <h3 className="text-2xl md:text-4xl text-[#18dbc1] mt-4 md:mt-6 font-semibold">
            Yape: oportunidades para todos
          </h3>

          <p className="mt-6 md:mt-8 text-lg md:text-xl text-gray-700">
             Descubre cómo es un día trabajando en Yape y da el primer paso hacia tu futuro laboral.
          </p>

          <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600">
               A través de este espacio podrás conocer de cerca la experiencia real dentro de nuestro equipo:
            jóvenes como tú aprendiendo, creciendo y construyendo oportunidades en el mundo financiero.
            No necesitas experiencia, solo las ganas de empezar.
          </p>

          <p className="mt-4 md:mt-6 text-lg md:text-xl font-bold text-gray-800">
            Empieza hoy tu camino. Mira el video, inspírate y comienza hoy tu camino con nosotros.
          </p>
        </div>

        {/* Video en formato horizontal (YouTube Style) */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-4xl aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#7422ff]/30">
            <video
              ref={videoRef}
              src={video}
              autoPlay
              muted
              loop
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </section>

      {/* ================= CARRUSEL 3D ================= */}
       
       <section className="pt-16 md:pt-24 pb-24 md:pb-32 text-center overflow-hidden">
  
  <h2 className="text-3xl md:text-5xl font-bold mb-12 md:mb-20 px-4">
    Tu camino en Yape
  </h2>

  <div className="relative h-[400px] md:h-[500px] flex justify-center items-center perspective-[1000px] md:perspective-[1800px]">

    {pasos.map((item, index) => {
      let offset = index - pasoActivo;

      if (offset > pasos.length / 2) offset -= pasos.length;
      if (offset < -pasos.length / 2) offset += pasos.length;

      return (
        <div
          key={index}
          onClick={() => setPasoActivo(index)}
          className="absolute w-[280px] md:w-[380px] h-[400px] md:h-[500px] cursor-pointer transition-all duration-700"
          style={{
            transform: `
              translateX(${offset * (window.innerWidth < 768 ? 200 : 320)}px)
              rotateY(${offset * -20}deg)
              scale(${offset === 0 ? (window.innerWidth < 768 ? 1.05 : 1.15) : 0.8})
            `,
            opacity: Math.abs(offset) > (window.innerWidth < 768 ? 1 : 2) ? 0 : 1,
            zIndex: 10 - Math.abs(offset),
          }}
        >
          <div className="bg-white rounded-[20px] md:rounded-[25px] shadow-xl overflow-hidden h-full border border-gray-100">
            <img src={item.img} className="w-full h-[200px] md:h-[300px] object-cover" alt={item.titulo} />
            <div className="p-4 md:p-6 text-left">
              <h3 className="text-xl md:text-2xl font-extrabold text-[#5F1DB3]">
                {item.titulo}
              </h3>
              <p className="text-sm md:text-base text-gray-700 mt-2 md:mt-3 font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      );
    })}

  </div>
</section>

      {/* ================= CONTADOR ================= */}
      <section className="py-16 md:py-28 text-center bg-gradient-to-r from-[#681992] via-[#8436ad] to-[#00CBBF] px-6">

        <h2 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto">
          No importa de dónde vienes, importa a dónde vas
        </h2>

        <div className="flex justify-center gap-2 md:gap-4 mt-10">
          {digits.map((d, i) => (
            <div
              key={i}
              className="w-12 h-16 md:w-20 md:h-24 bg-white/10 text-white text-3xl md:text-5xl flex items-center justify-center rounded-lg md:rounded-xl backdrop-blur-sm"
            >
              {d}
            </div>
          ))}
        </div>

        <p className="text-white mt-6 text-lg md:text-xl">
          +1000 jóvenes ya forman parte de Yape
        </p>

      </section>

      {/* ================= TARJETAS ================= */}
      <section className="py-16 md:py-24 text-center px-4">

        <h2 className="text-3xl md:text-5xl font-bold mb-10">
          ¿Por qué trabajar en Yape?
        </h2>

        <div className="relative max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-center gap-6">

          <button
            onClick={() =>
              setCarIndex((p) =>
                p === 0 ? Math.ceil(tarjetas.length / 3) - 1 : p - 1
              )
            }
            className="hidden md:flex absolute left-0 z-10 text-5xl w-14 h-14 bg-white shadow-md rounded-full items-center justify-center"
          >
            ‹
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 transition-all duration-700 w-full justify-center items-center">

            {tarjetas
              .slice(carIndex * (window.innerWidth < 768 ? 1 : 3), carIndex * (window.innerWidth < 768 ? 1 : 3) + (window.innerWidth < 768 ? 1 : 3))
              .map((item, i) => (
                <div key={i} className="w-full max-w-[350px] md:w-[420px] h-[280px] md:h-[320px] relative rounded-2xl overflow-hidden group shadow-lg">

                  <img src={item.img} className="w-full h-full object-cover" alt={item.titulo} />

                  <div className="absolute inset-0 bg-black/40 md:bg-black/0 md:group-hover:bg-black/60 transition flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100">

                    <div className="text-white text-center px-4">
                      <h3 className="text-xl md:text-2xl font-bold">{item.titulo}</h3>
                      <p className="mt-2 text-xs md:text-sm">{item.desc}</p>
                    </div>

                  </div>

                </div>
              ))}

          </div>

          <button
            onClick={() =>
              setCarIndex((p) =>
                (p + 1) % Math.ceil(tarjetas.length / (window.innerWidth < 768 ? 1 : 3))
              )
            }
            className="md:hidden mt-4 bg-[#7422ff] text-white px-6 py-2 rounded-full font-bold"
          >
            Siguiente motivo
          </button>

          <button
            onClick={() =>
              setCarIndex((p) =>
                (p + 1) % Math.ceil(tarjetas.length / 3)
              )
            }
            className="hidden md:flex absolute right-0 z-10 text-5xl w-14 h-14 bg-white shadow-md rounded-full items-center justify-center"
          >
            ›
          </button>

        </div>
      </section>

    </main>
  );
}