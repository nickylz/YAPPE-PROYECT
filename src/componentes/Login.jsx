import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useModal as useAppModal } from "../context/ModalContext";
import { FcGoogle } from "react-icons/fc";
import { LogOut } from "lucide-react";
import Modal from "./Modal";
import { Link } from "react-router-dom";

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
    <div className={`flex items-center justify-center rounded-full bg-[#d16170] text-white font-bold ${className}`} title={nombre}>
      <span>{getInitials(nombre)}</span>
    </div>
  );
};
// --- Fin de la lógica del Avatar ---

export default function Login({ isScrolled = false }) {
  const { usuarioActual, iniciarSesion, registrarUsuario, iniciarConGoogle, cerrarSesion } = useAuth();
  const { mostrarModal: mostrarNotificacion } = useAppModal();

  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regFoto, setRegFoto] = useState(null);

  useEffect(() => {
    if (usuarioActual && (modalLoginOpen || modalRegistroOpen)) {
      setModalLoginOpen(false);
      setModalRegistroOpen(false);
    }
  }, [usuarioActual, modalLoginOpen, modalRegistroOpen]);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await iniciarSesion(loginIdentifier, loginPass);
    } catch (err) {
      mostrarNotificacion("Error al iniciar sesión", err.message);
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

  function switchToLogin() {
    setModalRegistroOpen(false);
    setModalLoginOpen(true);
  }

  function switchToRegister() {
    setModalLoginOpen(false);
    setModalRegistroOpen(true);
  }

  const nombreMostrado = usuarioActual?.nombre || "Usuario";
  const usernameMostrado = usuarioActual?.username || "usuario";

  return (
    <>
      {usuarioActual ? (
        <div className="w-full">
          <div className="flex items-center gap-2">
            <Link
              to={`/perfil/${usernameMostrado}`}
              className={`flex items-center gap-3 rounded-full px-3 py-2 transition ${isScrolled ? 'bg-white/90 shadow-sm' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Avatar user={usuarioActual} className="w-10 h-10" />
              <span className={`font-semibold hidden sm:inline-block ${isScrolled ? 'text-[#42346c]' : 'text-white'}`}>Mi cuenta</span>
            </Link>
            <button
              onClick={cerrarSesion}
              className={`p-2 rounded-full transition ${isScrolled ? 'text-[#42346c] hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setModalLoginOpen(true)}
          className="bg-[#fff3f0] border border-[#da6786] text-[#da6786] font-semibold px-4 py-1.5 rounded-xl hover:bg-[#ffe5e0] transition-colors duration-300"
        >
          Iniciar sesión
        </button>
      )}

      <Modal isOpen={modalLoginOpen} onClose={() => setModalLoginOpen(false)} title="Bienvenido">
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Correo o Nombre de usuario" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]"/>
          <input type="password" placeholder="Contraseña" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button type="submit" className="bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold">Iniciar sesión</button>
            <button type="button" onClick={iniciarConGoogle} className="flex items-center justify-center gap-2 border border-[#d8718c] text-[#d8718c] py-3 rounded-xl hover:bg-[#f5bfb2] transition font-semibold">
              <FcGoogle className="text-xl" /> Google
            </button>
          </div>
        </form>
        <p className="text-[#7a1a0a] mt-6 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <button onClick={switchToRegister} className="text-[#d8718c] font-semibold hover:underline">Regístrate aquí</button>
        </p>
      </Modal>

      <Modal isOpen={modalRegistroOpen} onClose={() => setModalRegistroOpen(false)} title="Crear cuenta">
        <form onSubmit={handleRegistro} className="space-y-3">
            <input type="email" placeholder="Correo" value={regCorreo} onChange={(e) => setRegCorreo(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c]"/>
            <input type="text" placeholder="Nombre completo" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c]"/>
            <input type="text" placeholder="Nombre de usuario" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c]"/>
            <input type="password" placeholder="Contraseña" value={regPass} onChange={(e) => setRegPass(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c]"/>
            <div>
                <label htmlFor="foto-perfil" className="block text-sm font-medium text-[#8f2133] text-left mb-1">Foto de Perfil (Opcional)</label>
                <input type="file" id="foto-perfil" accept="image/*" onChange={(e) => setRegFoto(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#fff3f0] file:text-[#d16170] hover:file:bg-[#f5bfb2] border border-[#f5bfb2] rounded-xl"/>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
                <button type="submit" className="bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold">Crear cuenta</button>
                <button type="button" onClick={iniciarConGoogle} className="flex items-center justify-center gap-2 border border-[#d8718c] text-[#d8718c] py-3 rounded-xl hover:bg-[#f5bfb2] transition font-semibold">
                <FcGoogle className="text-xl" /> Google
                </button>
            </div>
        </form>
        <p className="text-[#7a1a0a] mt-5 text-sm">
          ¿Ya tienes cuenta?{" "}
          <button onClick={switchToLogin} className="text-[#d8718c] font-semibold hover:underline">Inicia sesión</button>
        </p>
      </Modal>
    </>
  );
}