import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  User, Mail, Phone, Link2, FileText,
  ArrowLeft, CheckCircle2, Loader
} from "lucide-react";
import toast from "react-hot-toast";
import cvImg from "../componentes/img/cvimg.png";

export default function FormularioDePostulacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [linkCV, setLinkCV] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const labelClass = "text-xs md:text-sm font-black text-[#3b0f52] uppercase tracking-[0.15em] ml-1 opacity-70";
  const inputClass = "w-full pl-12 pr-4 py-4 bg-white border-2 border-[#f0ebf5] rounded-2xl text-base md:text-lg text-[#3b0f52] font-semibold transition-all placeholder:text-gray-300 focus:outline-none focus:border-[#7e1d91] focus:ring-4 focus:ring-[#7e1d91]/5 shadow-sm";

  const handleCelularChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) setCelular(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDACIONES ESTRICTAS ---
    if (!nombre.trim()) return toast.error("Escribe tu nombre completo");
    if (!email.trim()) return toast.error("El correo es obligatorio");
    if (celular.length !== 9) return toast.error("El celular debe tener exactamente 9 números");
    if (!linkCV.trim()) return toast.error("Pega el enlace de tu CV o portafolio");

    setCargando(true);
    try {
      // Guardado en Firestore directamente con el Link
      await addDoc(collection(db, "postulaciones"), {
        nombre,
        email,
        celular,
        cvUrl: linkCV,
        vacanteId: id, 
        fecha: new Date(),
        estado: "Pendiente",
      });

      setEnviado(true);
      toast.success("¡Enviado con éxito!");
      setTimeout(() => navigate("/productos"), 3000);
    } catch (error) {
      console.error("Error al mandar:", error);
      toast.error("Error de conexión. Revisa la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans pb-24 text-left">
      {/* BANNER */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${cvImg})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b0f52]/95 via-[#7e1d91]/80 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 md:px-20 relative z-10">
          <span className="inline-block px-5 py-2 bg-[#25d3c9] text-[#3b0f52] text-xs font-black uppercase tracking-[0.3em] rounded-xl mb-6 shadow-xl">Talento Yape</span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight italic drop-shadow-lg">Trabaja <br /> con nosotros</h1>
          <p className="mt-6 text-white/90 text-lg md:text-xl max-w-xl font-medium leading-relaxed tracking-wide">Únete a la revolución digital del Perú. <br />Tu oportunidad está aquí.</p>
        </div>
      </section>

      {/* FORMULARIO */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-[0_30px_80px_rgba(59,15,82,0.08)] border border-[#f0e6ff]">
          <Link to="/productos" className="inline-flex items-center gap-2 text-[#7e1d91] font-black text-sm mb-12 hover:opacity-70 transition-all uppercase tracking-[0.2em]">
            <ArrowLeft size={18} /> Volver
          </Link>

          {enviado ? (
            <div className="text-center py-20 space-y-6">
              <CheckCircle2 size={80} className="text-[#25d3c9] mx-auto animate-bounce" />
              <h2 className="text-4xl font-black text-[#3b0f52] italic uppercase">¡Postulación enviada!</h2>
              <p className="text-gray-500 text-xl font-medium">Pronto nos pondremos en contacto contigo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* SECCIÓN INFORMACIÓN PERSONAL */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                  <div className="p-3 bg-[#fcfaff] rounded-2xl text-[#7e1d91]"><User size={24} /></div>
                  <h3 className="text-2xl font-black text-[#3b0f52] uppercase">Tu Información</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className={labelClass}>Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder="Ej. Juan Pérez" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className={labelClass}>Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="nombre@gmail.com" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-w-md">
                  <label className={labelClass}>WhatsApp / Celular (9 dígitos)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input type="tel" value={celular} onChange={handleCelularChange} className={inputClass} placeholder="999888777" />
                  </div>
                </div>
              </div>

              {/* SECCIÓN DOCUMENTACIÓN (SOLO LINK) */}
              <div className="space-y-8 pt-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                  <div className="p-3 bg-[#fcfaff] rounded-2xl text-[#25d3c9]"><FileText size={24} /></div>
                  <h3 className="text-2xl font-black text-[#3b0f52] uppercase">Documentación</h3>
                </div>

                <div className="space-y-3">
                  <label className={labelClass}>Link de Google Drive, LinkedIn o Portafolio</label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input
                      type="url"
                      value={linkCV}
                      onChange={(e) => setLinkCV(e.target.value)}
                      className={inputClass}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <p className="text-xs text-gray-400 ml-2 italic">Asegúrate de que el enlace sea público para que podamos verlo.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#7e1d91] text-white text-xl font-black py-6 rounded-2xl shadow-xl hover:bg-[#3b0f52] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-[0.2em] italic"
              >
                {cargando ? <Loader className="animate-spin" size={28} /> : <>Enviar Postulación <CheckCircle2 size={24} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}