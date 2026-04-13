import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import Login from "./Login";
import yapeLogo from "./img/Yape-icon.png";
import { useAuth } from "../context/authContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { usuarioActual, logout } = useAuth();
  const location = useLocation();

  const puedeVerIntranet =
    usuarioActual?.rol === "admin" || usuarioActual?.rol === "editor";

  const isHome = location.pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
  }, [menuOpen]);

  const isWhite = isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isWhite
            ? "bg-white border-b border-slate-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div
          className={`max-w-6xl mx-auto px-4 ${
            isHome ? (isScrolled ? "py-1" : "py-4") : "py-1"
          } flex items-center justify-between`}
        >
          {/* IZQUIERDA (logo + links) */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center p-1">
              <img
                src={yapeLogo}
                alt="Yape"
                className={`${
                  isHome
                    ? isScrolled
                      ? "w-11 h-11"
                      : "w-20 h-20"
                    : "w-11 h-11"
                } object-contain transition-all duration-300`}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/"
                className={`${
                  isWhite
                    ? "text-[#42346c] hover:bg-slate-100"
                    : "text-white hover:bg-white/20"
                } font-semibold px-3 py-1.5 rounded-full transition`}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className={`${
                  isWhite
                    ? "text-[#42346c] hover:bg-slate-100"
                    : "text-white hover:bg-white/20"
                } font-semibold px-3 py-1.5 rounded-full transition`}
              >
                Únete a Yappe
              </Link>
              <Link
                to="/nosotros"
                className={`${
                  isWhite
                    ? "text-[#42346c] hover:bg-slate-100"
                    : "text-white hover:bg-white/20"
                } font-semibold px-3 py-1.5 rounded-full transition`}
              >
                Nosotros
              </Link>
            <Link
                to="/centrodeayuda"
                className={`${
                    isWhite
                      ? "text-[#42346c] hover:bg-slate-100"
                      : "text-white hover:bg-white/20"
                  } font-semibold px-3 py-1.5 rounded-full transition`}
                >Centro de Ayuda </Link>


              {puedeVerIntranet && (
                <Link
                  to="/intranet"
                  className={`${
                    isWhite
                      ? "text-[#42346c] hover:bg-slate-100"
                      : "text-white hover:bg-white/20"
                  } font-semibold px-3 py-1.5 rounded-full transition`}
                >
                  Intranet
                </Link>
              )}
            </nav>
          </div>

          {/* DERECHA (login/cuenta) */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden lg:block">
              {/* Si hay usuario, envolvemos el Login en un Link a perfil */}
              {usuarioActual ? (
                <Link
                  to={`/perfil/${usuarioActual?.username || "user"}`}
                  className="block"
                >
                  <Login isScrolled={isWhite} />
                </Link>
              ) : (
                <Login isScrolled={isWhite} />
              )}
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className={`${
                isWhite ? "text-[#42346c]" : "text-white"
              } text-2xl lg:hidden`}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>
      {/* MENÚ MÓVIL FULL SCREEN */}
      <div
        className={`fixed inset-0 bg-white z-60 transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        } lg:hidden flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-100">
          <img src={yapeLogo} className="w-10" alt="Logo" />
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes className="text-[#42346c] text-3xl" />
          </button>
        </div>

        <nav className="flex-1 px-8 py-10 flex flex-col gap-6 text-[#42346c]">
          <Link to="/" className="text-2xl font-bold text-[#00d1b2]">
            Inicio
          </Link>
          <Link to="/productos" className="text-2xl font-bold">
            Productos
          </Link>
          <Link to="/nosotros" className="text-2xl font-bold">
            Nosotros
          </Link>
          {puedeVerIntranet && (
            <Link to="/intranet" className="text-2xl font-bold">
              Intranet
            </Link>
          )}
        </nav>

        {/* PARTE INFERIOR MÓVIL */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          {usuarioActual ? (
            <div className="flex flex-col gap-3 w-full">
              {" "}
              {/* Contenedor para poner uno debajo del otro */}
              {/* Sección Mi Cuenta */}
              <Link
                to={`/perfil/${usuarioActual?.username || "user"}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-[#42346c] font-bold active:scale-95 transition"
                onClick={() => setMenuOpen(false)}
              >
                <div className="scale-110">
                  <Login isScrolled={true} />
                </div>
                <span className="text-xl whitespace-nowrap">Mi cuenta</span>
              </Link>
              {/* Botón Cerrar Sesión (Ahora siempre abajo) */}
              <button
                onClick={async () => {
                  await cerrarSesion(); // Llama a la función del context
                  setMenuOpen(false);
                  navigate("/");
                }}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#7e1d91] text-white rounded-2xl font-bold shadow-md active:scale-95 transition"
              >
                <FaSignOutAlt className="text-lg" />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="w-full bg-[#7e1d91] rounded-2xl py-4 flex justify-center shadow-lg">
              <Login />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
