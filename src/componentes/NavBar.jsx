import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Login from "./Login";
import yapeLogo from "./img/Yape-icon.png";
import { useAuth } from "../context/authContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { usuarioActual } = useAuth();
  const location = useLocation();

  const puedeVerIntranet = usuarioActual?.rol === "admin" || usuarioActual?.rol === "editor";
  const forceWhiteNavbar = location.pathname.includes('/perfil');

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      <header className={`${forceWhiteNavbar || isScrolled ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-[#7e1d91] border-b border-[#6a187a] shadow-xl'} sticky top-0 z-50 transition-all duration-300`}>
        <div className={`max-w-6xl mx-auto px-4 ${forceWhiteNavbar || isScrolled ? 'py-2' : 'py-4'} flex flex-wrap items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center justify-center rounded-3xl p-2 transition">
              <img src={yapeLogo} alt="Yape" className={`${forceWhiteNavbar || isScrolled ? 'w-14 h-14' : 'w-20 h-20'} object-contain transition-all duration-300`} />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-3 flex-1 justify-start lg:pl-4">
            <Link to="/" className={`${forceWhiteNavbar || isScrolled ? 'text-[#42346c] hover:text-[#7e1d91]' : 'text-white'} font-semibold py-2 px-4 rounded-full ${forceWhiteNavbar || isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'} transition-colors`}>Inicio</Link>
            <Link to="/productos" className={`${forceWhiteNavbar || isScrolled ? 'text-[#42346c] hover:text-[#7e1d91]' : 'text-white'} font-semibold py-2 px-4 rounded-full ${forceWhiteNavbar || isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'} transition-colors`}>Productos</Link>
            <Link to="/nosotros" className={`${forceWhiteNavbar || isScrolled ? 'text-[#42346c] hover:text-[#7e1d91]' : 'text-white'} font-semibold py-2 px-4 rounded-full ${forceWhiteNavbar || isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'} transition-colors`}>Nosotros</Link>
            {puedeVerIntranet && (
              <Link to="/intranet" className={`${forceWhiteNavbar || isScrolled ? 'text-[#42346c] hover:text-[#7e1d91]' : 'text-white'} font-semibold py-2 px-4 rounded-full ${forceWhiteNavbar || isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'} transition-colors`}>Intranet</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Login isScrolled={forceWhiteNavbar || isScrolled} />
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className={`${forceWhiteNavbar || isScrolled ? 'text-[#42346c]' : 'text-white'} text-2xl lg:hidden`}
              aria-label="Abrir menú"
            >
              <FaBars size={28} />
            </button>
          </div>
        </div>
      </header>
      
      {/* --- Menú lateral móvil --- */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-linear-to-b from-[#7e1d91] via-[#6a187a] to-[#5a146a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                 <Link to="/" className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 p-2 shadow-sm">
                    <img src={yapeLogo} alt="Yape" className="w-12 h-12 object-contain" />
                </Link>
                <button
                    onClick={() => setMenuOpen(false)}
                    className="text-white text-2xl"
                    aria-label="Cerrar menú"
                >
                    <FaTimes />
                </button>
            </div>
          
            <nav className="flex flex-col gap-3 text-left">
                <Link to="/" className="text-white font-semibold p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors">Inicio</Link>
                <Link to="/productos" className="text-white font-semibold p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors">Productos</Link>
                <Link to="/nosotros" className="text-white font-semibold p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors">Nosotros</Link>
                {puedeVerIntranet && (
                    <Link to="/intranet" className="text-white font-semibold p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors">Intranet</Link>
                )}
                <div className="border-t border-white/15 pt-4 mt-4">
                    <Login />
                </div>
            </nav>
        </div>
      </div>
    </>
  );
}
