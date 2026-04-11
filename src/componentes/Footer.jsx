import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaBook,
} from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  const infoLinks = [
    { to: "/terminos-y-condiciones", text: "Términos y Condiciones" },
  ];

  return (
    <footer className="bg-[#7e1d91] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[#e8d7ff]">Síguenos en:</p>
              <h2 className="text-3xl font-extrabold">Conéctate con nosotros</h2>
            </div>
            <p className="max-w-md text-sm text-white/80">
              Conecta con nosotros en redes sociales y mantente al día con nuestras últimas noticias, promociones y novedades.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition duration-300 hover:bg-white hover:text-[#7e1d91]"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Enlaces legales</h3>
            <ul className="space-y-3 text-sm text-white/80">
              {infoLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block transition-colors duration-300 hover:text-white"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 rounded-4xl border border-white/15 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-[#f3d4ff]">
                <FaBook className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-white/80">Libro de Reclamaciones</p>
                <p className="text-lg font-semibold">Acceso rápido y seguro</p>
              </div>
            </div>
            <Link
              to="/libro-de-reclamaciones"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#7e1d91] transition duration-300 hover:bg-[#f3d4ff]"
            >
              Ver libro de reclamaciones
            </Link>
            <Link
              to="/trabaja-con-nosotros"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/20"
            >
              Trabaja con nosotros
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#6a187a] py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 px-4 sm:px-6 lg:px-8 text-center text-sm text-white/70 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2025. Todos los derechos reservados</p>
          <p>BANCO DE CRÉDITO DEL PERÚ - RUC: 20100047218</p>
        </div>
      </div>
    </footer>
  );
}