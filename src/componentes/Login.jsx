import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useModal as useAppModal } from "../context/ModalContext";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa"; 
import Modal from "./Modal";
import { Link, useNavigate } from "react-router-dom";

// --- Lógica del Avatar ---
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
  const { nombre, fotoURL } = user;

  if (fotoURL) {
    return <img src={fotoURL} alt={`Avatar de ${nombre}`} className={`rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-[#7e1d91] text-white font-black italic ${className}`} title={nombre}>
      <span>{getInitials(nombre)}</span>
    </div>
  );
};

export default function Login({ isScrolled = false }) {
  const { usuarioActual, iniciarSesion, registrarUsuario, iniciarConGoogle, cerrarSesion } = useAuth();
  const { mostrarModal: mostrarNotificacion } = useAppModal();
  const navigate = useNavigate();

  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regFoto, setRegFoto] = useState(null);

  // Estilos base extraídos del formulario de postulación
  const inputClass = "w-full bg-white border-2 border-[#f0ebf5] text-[#3b0f52] px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:border-[#7e1d91] focus:ring-4 focus:ring-[#7e1d91]/5 shadow-sm placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-black text-[#3b0f52] uppercase tracking-[0.15em] ml-1 mb-1 opacity-70";

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
      await registrarUsuario(regCorreo, regNombre, regUsername, regPass, regFoto);
      mostrarNotificacion("¡Cuenta Creada!", "Tu registro fue exitoso. Ahora puedes iniciar sesión.");
      setModalRegistroOpen(false);
      setModalLoginOpen(true);
    } catch (err) {
      mostrarNotificacion("Error en el registro", err.message);
    }
  }

  const usernameMostrado = usuarioActual?.username || "usuario";

  return (
    <>
      {usuarioActual ? (
        <div className="w-full">
          <div className="flex items-center gap-2">
            <Link
              to={`/perfil/${usernameMostrado}`}
              className={`flex items-center gap-3 rounded-[20px] px-4 py-2 transition-all ${
                isScrolled ? 'bg-white shadow-sm border border-[#f0ebf5]' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Avatar user={usuarioActual} className="w-9 h-9 border-2 border-[#fcfaff]" />
              <span className={`font-black uppercase italic text-xs tracking-wider hidden sm:inline-block ${
                isScrolled ? 'text-[#3b0f52]' : 'text-white'
              }`}>
                Mi cuenta
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                isScrolled ? 'text-[#7e1d91] hover:bg-[#fcfaff]' : 'text-white hover:bg-white/20'
              }`}
              title="Cerrar sesión"
            >
              <FaSignOutAlt size={22} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setModalLoginOpen(true)}
          className="bg-[#fcfaff] border-2 border-[#7e1d91]/20 text-[#7e1d91] font-black uppercase italic text-xs tracking-[0.1em] px-6 py-2.5 rounded-[18px] hover:bg-[#7e1d91] hover:text-white hover:border-[#7e1d91] transition-all duration-300 shadow-sm shadow-[#7e1d91]/5"
        >
          Iniciar sesión
        </button>
      )}

      {/* --- Modales con Estilo Yape --- */}
      <Modal isOpen={modalLoginOpen} onClose={() => setModalLoginOpen(false)} title="HOLA YAPER">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className={labelClass}>Identificación</label>
            <input type="text" placeholder="Correo o Username" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} className={inputClass}/>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Tu Contraseña</label>
            <input type="password" placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button type="submit" className="bg-[#7e1d91] text-white py-4 rounded-2xl hover:bg-[#3b0f52] transition-all font-black uppercase italic text-xs tracking-widest shadow-lg shadow-[#7e1d91]/20">Entrar</button>
            <button type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 border-2 border-[#f0ebf5] text-[#3b0f52] py-4 rounded-2xl hover:bg-[#fcfaff] transition-all font-black uppercase italic text-xs tracking-widest">
              <FcGoogle className="text-xl" /> Google
            </button>
          </div>
        </form>
        <p className="text-[#3b0f52]/60 mt-8 text-center text-[11px] font-bold uppercase tracking-wider">
          ¿Eres nuevo?{" "}
          <button onClick={() => { setModalLoginOpen(false); setModalRegistroOpen(true); }} className="text-[#7e1d91] font-black hover:underline italic">Únete aquí</button>
        </p>
      </Modal>

      <Modal isOpen={modalRegistroOpen} onClose={() => setModalRegistroOpen(false)} title="NUEVO TALENTO">
        <form onSubmit={handleRegistro} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Nombre Completo</label>
                <input type="text" placeholder="Ej. Juan Pérez" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} className={inputClass}/>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Username</label>
                <input type="text" placeholder="juanp_24" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} className={inputClass}/>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className={labelClass}>Correo Electrónico</label>
              <input type="email" placeholder="nombre@gmail.com" value={regCorreo} onChange={(e) => setRegCorreo(e.target.value)} className={inputClass}/>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Contraseña</label>
              <input type="password" placeholder="Crea una clave" value={regPass} onChange={(e) => setRegPass(e.target.value)} className={inputClass}/>
            </div>

            <div className="bg-[#fcfaff] p-4 rounded-2xl border border-[#f0ebf5]">
                <label htmlFor="foto-perfil" className={labelClass}>Foto de Perfil (Opcional)</label>
                <input type="file" id="foto-perfil" accept="image/*" onChange={(e) => setRegFoto(e.target.files[0])} className="block w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-[#7e1d91] file:text-white hover:file:bg-[#3b0f52] file:uppercase file:italic cursor-pointer"/>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
                <button type="submit" className="bg-[#7e1d91] text-white py-4 rounded-2xl hover:bg-[#3b0f52] transition-all font-black uppercase italic text-xs tracking-widest shadow-lg shadow-[#7e1d91]/20">Registrarme</button>
                <button type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 border-2 border-[#f0ebf5] text-[#3b0f52] py-4 rounded-2xl hover:bg-[#fcfaff] transition-all font-black uppercase italic text-xs tracking-widest">
                <FcGoogle className="text-xl" /> Google
                </button>
            </div>
        </form>
        <p className="text-[#3b0f52]/60 mt-6 text-center text-[11px] font-bold uppercase tracking-wider">
          ¿Ya tienes cuenta?{" "}
          <button onClick={() => { setModalRegistroOpen(false); setModalLoginOpen(true); }} className="text-[#7e1d91] font-black hover:underline italic">Inicia sesión</button>
        </p>
      </Modal>
    </>
  );
}