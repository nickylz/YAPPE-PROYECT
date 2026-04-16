import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useModal as useAppModal } from "../context/ModalContext";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt, FaUser, FaLock, FaEnvelope, FaAt, FaLink } from "react-icons/fa";
import { X, UserPlus, LogIn } from "lucide-react";
import Modal from "./Modal";
import { Link, useNavigate } from "react-router-dom";

// --- Lógica del Avatar con Iniciales ---
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Avatar = ({ user, className = '' }) => {
  if (!user) return null;
  const { nombre, fotoURL, username } = user;

  if (fotoURL && fotoURL !== "") {
    return <img src={fotoURL} alt={`Avatar de ${nombre}`} className={`rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-[#7e1d91] text-white font-black italic ${className}`} title={nombre}>
      <span className="text-[40%] uppercase">
        {getInitials(username || nombre)}
      </span>
    </div>
  );
};

export default function Login({ isScrolled = false }) {
  const { usuarioActual, iniciarSesion, registrarUsuario, iniciarConGoogle, cerrarSesion } = useAuth();
  const { mostrarModal: mostrarNotificacion } = useAppModal();
  const navigate = useNavigate();

  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);

  // Estados de formulario
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regFotoURL, setRegFotoURL] = useState("");

  // Estilos compartidos con Libro de Reclamaciones
  const inputClass = "w-full px-6 py-4 bg-[#fcfaff] border-2 border-[#f0ebf5] rounded-[20px] text-[#3b0f52] font-semibold transition-all placeholder:text-[#6b4a88]/40 focus:outline-none focus:border-[#00d1c4] focus:ring-4 focus:ring-[#00d1c4]/10";
  const labelClass = "text-xs font-black text-[#3b0f52] uppercase ml-2 mb-2 block opacity-60 tracking-widest";

  useEffect(() => {
    if (usuarioActual && (modalLoginOpen || modalRegistroOpen)) {
      setModalLoginOpen(false);
      setModalRegistroOpen(false);
    }
  }, [usuarioActual, modalLoginOpen, modalRegistroOpen]);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await iniciarSesion(loginIdentifier, loginPass);
    } catch (err) {
      mostrarNotificacion("Error al iniciar sesión", err.message);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await iniciarConGoogle();
    } catch (err) {
      mostrarNotificacion("Error con Google", err.message);
    }
  }

  async function handleRegistro(e) {
    e.preventDefault();
    try {
      await registrarUsuario(regCorreo, regNombre, regUsername, regPass, regFotoURL);
      mostrarNotificacion("¡Bienvenido Yaper!", "Tu registro fue exitoso. Ya eres parte del equipo.");
      setModalRegistroOpen(false);
      setModalLoginOpen(true);
    } catch (err) {
      mostrarNotificacion("Error en el registro", err.message);
    }
  }

  const usernameMostrado = usuarioActual?.username || "usuario";

  return (
    <>
      {/* Botón de Perfil / Iniciar Sesión en el Header */}
      {usuarioActual ? (
        <div className="flex items-center gap-3">
          <Link
            to={`/perfil/${usernameMostrado}`}
            className={`flex items-center gap-3 rounded-[24px] px-4 py-2 transition-all duration-300 ${isScrolled ? 'bg-[#7e1d91]/5 shadow-sm border border-[#7e1d91]/10' : 'bg-white/10 hover:bg-white/20'
              }`}
          >
            <Avatar user={usuarioActual} className="w-9 h-9 border-2 border-white shadow-sm" />
            <span className={`font-black uppercase italic text-xs tracking-wider hidden sm:inline-block ${isScrolled ? 'text-[#3b0f52]' : 'text-white'
              }`}>
              Hola, {usuarioActual.username.split(' ')[0]}
            </span>
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setModalLoginOpen(true)}
          className="lg:bg-[#00d1c4] lg:text-[#3b0f52] lg:px-8 lg:py-3 lg:rounded-[20px] lg:hover:bg-[#3b0f52] lg:hover:text-white lg:shadow-lg lg:shadow-cyan-500/20 
               text-white bg-transparent font-black uppercase italic text-xs tracking-[0.15em] transition-all duration-500"
        >
          Entrar
        </button>
      )}

      {/* MODAL DE LOGIN */}
      <Modal isOpen={modalLoginOpen} onClose={() => setModalLoginOpen(false)}>
        <div className="max-h-[85vh] overflow-y-auto px-2 custom-scrollbar">
          <div className="text-center mb-10 mt-4">
            <div className="w-20 h-20 bg-[#7e1d91]/10 rounded-[28px] flex items-center justify-center mx-auto text-[#7e1d91] mb-6 transform -rotate-12">
              <LogIn size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-[#3b0f52] italic tracking-tighter">HOLA YAPER</h2>
            <p className="text-[#6b4a88] font-medium mt-2">Ingresa para seguir fluyendo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className={labelClass}>Tu Identificación</label>
              <div className="relative">
                <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]" />
                <input
                  type="text"
                  placeholder="Correo o Username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className={`${inputClass} pl-14`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Tu Clave</label>
              <div className="relative">
                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className={`${inputClass} pl-14`}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                className="w-full bg-[#7e1d91] text-white py-5 rounded-[24px] font-black uppercase italic tracking-widest shadow-xl shadow-purple-200 hover:bg-[#3b0f52] hover:scale-[1.02] active:scale-95 transition-all"
              >
                ENTRAR AHORA
              </button>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#f0ebf5] text-[#3b0f52] py-4 rounded-[24px] font-black uppercase italic text-xs tracking-widest hover:bg-[#fcfaff] transition-all"
              >
                <FcGoogle size={24} /> Entrar con Google
              </button>
            </div>
          </form>

          <div className="mt-10 pb-4 text-center">
            <p className="text-[#3b0f52]/60 text-[11px] font-black uppercase tracking-[0.2em]">
              ¿Nuevo por aquí? <br />
              <button
                onClick={() => { setModalLoginOpen(false); setModalRegistroOpen(true); }}
                className="text-[#00d1c4] font-black hover:underline italic mt-2 text-sm"
              >
                Crea tu cuenta aquí
              </button>
            </p>
          </div>
        </div>
      </Modal>

      {/* MODAL DE REGISTRO */}
      <Modal isOpen={modalRegistroOpen} onClose={() => setModalRegistroOpen(false)}>
        <div className="max-h-[85vh] overflow-y-auto px-2 custom-scrollbar">
          <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-[#00d1c4]/10 rounded-[28px] flex items-center justify-center mx-auto text-[#00d1c4] mb-6 transform rotate-12">
              <UserPlus size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-[#3b0f52] italic tracking-tighter uppercase">Nuevo Talento</h2>
            <p className="text-[#6b4a88] font-medium mt-2">Únete a la vibra más grande</p>
          </div>

          <form onSubmit={handleRegistro} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Nombres</label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Username</label>
                <div className="relative">
                  <FaAt className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7e1d91]/40" />
                  <input
                    type="text"
                    placeholder="juan_24"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className={`${inputClass} pl-12`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Correo Electrónico</label>
              <div className="relative">
                <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]/40" />
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={regCorreo}
                  onChange={(e) => setRegCorreo(e.target.value)}
                  className={`${inputClass} pl-14`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Tu Contraseña</label>
              <div className="relative">
                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]/40" />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className={`${inputClass} pl-14`}
                  required
                />
              </div>
            </div>

            <div className="bg-[#fcfaff] p-6 rounded-[32px] border-2 border-dashed border-[#f0ebf5] space-y-3">
              <label className={labelClass}>Link de Foto de Perfil</label>
              <div className="relative">
                <FaLink className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00d1c4]" />
                <input
                  type="url"
                  placeholder="https://imagen.com/foto.jpg"
                  value={regFotoURL}
                  onChange={(e) => setRegFotoURL(e.target.value)}
                  className={`${inputClass} pl-14 bg-white`}
                />
              </div>
              <p className="text-[10px] text-center font-bold text-[#6b4a88]/50 uppercase tracking-widest">
                Si no tienes uno, usaremos tu inicial
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button
                type="submit"
                className="w-full bg-[#7e1d91] text-white py-5 rounded-[24px] font-black uppercase italic tracking-widest shadow-xl shadow-purple-200 hover:bg-[#3b0f52] hover:scale-[1.02] active:scale-95 transition-all"
              >
                CREAR MI CUENTA
              </button>
            </div>
          </form>

          <div className="mt-8 pb-6 text-center">
            <p className="text-[#3b0f52]/60 text-[11px] font-black uppercase tracking-[0.2em]">
              ¿Ya eres yaper@? <br />
              <button
                onClick={() => { setModalRegistroOpen(false); setModalLoginOpen(true); }}
                className="text-[#7e1d91] font-black hover:underline italic mt-2 text-sm"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </Modal>


    </>
  );
}