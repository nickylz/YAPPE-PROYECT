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

  // SECCIÓN EDITADA CON LINKS TIPO HTTPS
  const infoLinks = [
    { text: "Términos y Condiciones", url: "https://www.yape.com.pe/terminos-y-condiciones/yape-persona" },
    { text: "Política de privacidad y Datos personales", url: "https://www.yape.com.pe/politica-privacidad-datos/yape" },
    { text: "Política de Cookies", url: "https://www.yape.com.pe/politica-privacidad-datos/cookies" },
    { text: "Consentimiento para el uso de cookies", url: "https://www.yape.com.pe/consentimiento-cookies" },
  ];

  return (
    <footer className="relative bg-[#7e1d91] text-white">
      {/* BOTÓN VOLVER ARRIBA */}
      <div className="absolute left-1/2 -top-10 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group">
        <span
          className={`bg-[#18dbc1] text-white text-xs px-3 py-1 rounded-full shadow-md transition-opacity duration-300 ${
            showLabel ? "opacity-100" : "opacity-0"
          }`}
        >
          Volver arriba
        </span>

        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-[#18dbc1] text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        >
          <FaChevronUp
            size={18}
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
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
              <h2 className="text-3xl font-extrabold">Conéctate con nosotros</h2>
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

          {/* SECCIÓN LINKS LEGALES (ACTUALIZADA) */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Enlaces legales</h3>
            <ul className="space-y-3 text-sm text-white/80">
              {infoLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    {link.text}
                  </a>
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
              to="/unete"
              className="w-full flex justify-center border border-white/20 py-3 rounded-full hover:bg-white/20"
            >
              Trabaja con nosotros
            </Link>
          </div>
        </div>
      </div>

      {/* FRANJA DE COPYRIGHT */}
      <div className="border-t border-white/10 bg-[#6a187a] py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 text-center text-sm text-white/70 lg:flex-row lg:justify-between px-4">
          <p>© 2025. Todos los derechos reservados</p>
          <p>BANCO DE CRÉDITO DEL PERÚ - RUC: 20100047218</p>
        </div>
      </div>
    </footer>
  );
}