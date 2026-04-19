import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import {
  User,
  Mail,
  Phone,
  Link2,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Loader,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import cvImg from "../componentes/img/cvimg.png";
import { useAuth } from "../context/AuthContext";

export default function FormularioDePostulacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();

  const [nombre, setNombre] = useState(usuarioActual?.displayName || "");
  const [email, setEmail] = useState(usuarioActual?.email || "");
  const [celular, setCelular] = useState("");
  const [linkCV, setLinkCV] = useState("");
  const [nombreVacante, setNombreVacante] = useState(""); // Para mostrar el puesto en el banner

  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [rol, setRol] = useState(null);
  const [buscandoRol, setBuscandoRol] = useState(true);

  const labelClass =
    "text-xs md:text-sm font-black text-[#3b0f52] uppercase tracking-[0.15em] ml-1 opacity-70";
  const inputClass =
    "w-full pl-12 pr-4 py-4 bg-white border-2 border-[#f0ebf5] rounded-2xl text-base md:text-lg text-[#3b0f52] font-semibold transition-all placeholder:text-gray-300 focus:outline-none focus:border-[#7e1d91] focus:ring-4 focus:ring-[#7e1d91]/5 shadow-sm disabled:bg-gray-50 disabled:text-gray-400";

  useEffect(() => {
    if (!usuarioActual) {
      toast.error("Debes iniciar sesión primero");
      navigate("/login");
      return;
    }

    const cargarDatosIniciales = async () => {
      try {
        // 1. Obtener Rol
        const userDoc = await getDoc(doc(db, "usuarios", usuarioActual.uid));
        if (userDoc.exists()) {
          setRol(userDoc.data().rol);
        }

        // 2. Obtener Info de la Vacante (Opcional pero recomendado para el diseño)
        const vacanteDoc = await getDoc(doc(db, "vacantes", id));
        if (vacanteDoc.exists()) {
          setNombreVacante(
            vacanteDoc.data().titulo || vacanteDoc.data().nombre,
          );
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setBuscandoRol(false);
      }
    };

    cargarDatosIniciales();
  }, [usuarioActual, navigate, id]);

  const esStaff = rol === "admin" || rol === "editor";

  const handleCelularChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) setCelular(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (esStaff)
      return toast.error("El personal administrativo no puede postular.");
    if (!nombre.trim()) return toast.error("Escribe tu nombre completo");
    if (celular.length !== 9)
      return toast.error("El celular debe tener 9 dígitos");
    if (!linkCV.includes("http"))
      return toast.error("Ingresa un enlace válido (http/https)");

    setCargando(true);
    try {
      await addDoc(collection(db, "postulaciones"), {
        nombrePostulante: nombre,
        correo: email,
        celular: celular,
        cvUrl: linkCV,
        puestoId: id,
        nombrePuesto: nombreVacante || "Puesto no especificado",
        fecha: new Date(),
        estado: "Recibido",
        usuarioUid: usuarioActual.uid, // Para historial del usuario
      });

      setEnviado(true);
      toast.success("¡Éxito! Postulación enviada.");
      setTimeout(() => navigate("/productos"), 3000);
    } catch (error) {
      console.error("Error Firebase:", error);
      toast.error("Hubo un problema al enviar. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  if (!usuarioActual || buscandoRol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaff]">
        <Loader className="animate-spin text-[#7e1d91]" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans pb-24 text-left">
      {/* BANNER DINÁMICO */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cvImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b0f52]/95 via-[#7e1d91]/80 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 md:px-20 relative z-10">
          <span className="inline-block px-5 py-2 bg-[#25d3c9] text-[#3b0f52] text-xs font-black uppercase tracking-[0.3em] rounded-xl mb-6 shadow-xl">
            Talento Yape
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight italic drop-shadow-lg">
            {nombreVacante
              ? `Postula a ${nombreVacante}`
              : "Trabaja con nosotros"}
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-[0_30px_80px_rgba(59,15,82,0.08)] border border-[#f0e6ff]">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-[#7e1d91] font-black text-sm mb-12 hover:opacity-70 transition-all uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={18} /> Volver a vacantes
          </Link>

          {enviado ? (
            <div className="text-center py-20 space-y-6">
              <CheckCircle2
                size={80}
                className="text-[#25d3c9] mx-auto animate-bounce"
              />
              <h2 className="text-4xl font-black text-[#3b0f52] italic uppercase">
                ¡Postulación enviada!
              </h2>
              <p className="text-gray-500 text-xl font-medium">
                Revisaremos tu perfil y nos contactaremos contigo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* SECCIÓN INFO */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                  <div className="p-3 bg-[#fcfaff] rounded-2xl text-[#7e1d91]">
                    <User size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-[#3b0f52] uppercase">
                    Tu Información
                  </h3>
                </div>

                {esStaff && (
                  <div className="flex items-center gap-4 p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] mb-6">
                    <ShieldAlert className="text-red-500" size={32} />
                    <p className="text-red-600 font-bold">
                      Modo Administrador: Postulaciones deshabilitadas.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className={labelClass}>Nombre Completo</label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        size={20}
                      />
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={inputClass}
                        disabled={esStaff || cargando}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={labelClass}>Correo Electrónico</label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        size={20}
                      />
                      <input
                        type="email"
                        value={email}
                        className={inputClass}
                        disabled={true} // El correo no debería cambiarse si viene de la auth
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-w-md">
                  <label className={labelClass}>WhatsApp / Celular</label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={20}
                    />
                    <input
                      type="tel"
                      value={celular}
                      onChange={handleCelularChange}
                      className={inputClass}
                      placeholder="999888777"
                      disabled={esStaff || cargando}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN DOCS */}
              <div className="space-y-8 pt-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                  <div className="p-3 bg-[#fcfaff] rounded-2xl text-[#25d3c9]">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-[#3b0f52] uppercase">
                    Documentación
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className={labelClass}>
                    Link de CV (Drive / LinkedIn)
                  </label>
                  <div className="relative">
                    <Link2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={20}
                    />
                    <input
                      type="url"
                      value={linkCV}
                      onChange={(e) => setLinkCV(e.target.value)}
                      className={inputClass}
                      placeholder="https://drive.google.com/..."
                      disabled={esStaff || cargando}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando || esStaff}
                className={`w-full text-xl font-black py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] italic 
                  ${esStaff ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#7e1d91] text-white hover:bg-[#3b0f52] active:scale-95"} 
                  disabled:opacity-50`}
              >
                {cargando ? (
                  <Loader className="animate-spin" size={28} />
                ) : (
                  "Enviar Postulación"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
