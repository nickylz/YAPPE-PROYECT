import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaBook,
  FaChevronUp,
} from "react-icons/fa";

export default function Footer() {
  const [showLabel, setShowLabel] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // El texto "Volver arriba" aparece solo al hacer scroll hacia arriba
      // y después de haber bajado al menos 300px
      if (currentScrollY < lastScrollY.current && currentScrollY > 300) {
        setShowLabel(true);
      } else {
        setShowLabel(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: FaInstagram, href: "https://www.instagram.com/yapeoficial/", label: "Instagram" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@yapeoficial", label: "TikTok" },
    { icon: FaFacebook, href: "https://www.facebook.com/yapeoficial", label: "Facebook" },
    { icon: FaLinkedin, href: "https://pe.linkedin.com/company/yapeoficial", label: "LinkedIn" },
    { icon: FaYoutube, href: "https://www.youtube.com/c/YapeOficial", label: "YouTube" },
  ];

  const infoLinks = [
    { to: "/terminos-y-condiciones", text: "Términos y Condiciones" },
  ];

  return (
    <footer className="relative bg-[#7e1d91] text-white">
      
      {/* BOTÓN VOLVER ARRIBA - MÁS PEQUEÑO, ESTÁTICO Y CENTRADO */}
      {/* Usamos 'group' para animar el círculo y el icono juntos al hover */}
      <div className="absolute left-1/2 -top-10 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group">
        
        {/* Etiqueta de texto (aparece con scroll hacia arriba) */}
        <span
          className={`bg-[#18dbc1] text-white text-xs px-3 py-1 rounded-full shadow-md transition-opacity duration-300 ${
            showLabel ? "opacity-100" : "opacity-0"
          }`}
        >
          Volver arriba
        </span>

        {/* Botón Circular con animación hover */}
        <button
          onClick={scrollToTop}
          // Tamaño reducido a w-12 h-12. hover:scale-110 hace crecer el círculo.
          className="w-12 h-12 rounded-full bg-[#18dbc1] text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        >
          {/* Icono más pequeño. group-hover:scale-110 hace crecer el icono también. */}
          <FaChevronUp size={18} className="transition-transform duration-300 ease-in-out group-hover:scale-110" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr]">
          
          {/* SECCIÓN REDES */}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[#e8d7ff]">
                Síguenos en:
              </p>
              <h2 className="text-3xl font-extrabold">
                Conéctate con nosotros
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/80">
              Conecta con nosotros en redes sociales y mantente al día con nuestras últimas noticias.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 hover:bg-white hover:text-[#7e1d91] transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* SECCIÓN LINKS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Enlaces legales</h3>
            <ul className="space-y-3 text-sm text-white/80">
              {infoLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TARJETA DE ACCESOS */}
          <div className="space-y-5 rounded-4xl border border-white/15 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-3xl bg-white/10">
                <FaBook />
              </div>
              <div>
                <p className="text-sm text-white/80">Libro de Reclamaciones</p>
                <p className="font-semibold">Acceso rápido y seguro</p>
              </div>
            </div>
            <Link
              to="/libro-de-reclamaciones"
              className="w-full flex justify-center bg-white text-[#7e1d91] py-3 rounded-full font-semibold hover:bg-[#f3d4ff]"
            >
              Ver libro de reclamaciones
            </Link>
            <Link
              to="/trabaja-con-nosotros"
              className="w-full flex justify-center border border-white/20 py-3 rounded-full hover:bg-white/20"
            >
              Trabaja con nosotros
            </Link>
          </div>

        </div>
      </div>

      {/* FRANJA DE COPYRIGHT Y RUC */}
      <div className="border-t border-white/10 bg-[#6a187a] py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 text-center text-sm text-white/70 lg:flex-row lg:justify-between px-4">
          <p>© 2025. Todos los derechos reservados</p>
          <p>BANCO DE CRÉDITO DEL PERÚ - RUC: 20100047218</p>
        </div>
      </div>
    </footer>
  );
}