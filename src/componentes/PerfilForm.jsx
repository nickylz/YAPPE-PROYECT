import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { format } from 'date-fns';
import { Edit2, Loader, Link as LinkIcon, User, ChevronUp, CheckCircle2 } from 'lucide-react';

// URL de la imagen predeterminada
const FOTO_PREDETERMINADA = "https://marketingperu.beglobal.biz/wp-content/uploads/2025/06/yapito-boliviano.png";

export default function PerfilForm() {
  const { usuarioActual, actualizarPerfil, cargando: cargandoAuth } = useAuth();
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [nuevoLinkFoto, setNuevoLinkFoto] = useState('');

  // Validación de formatos permitidos
  const formatosValidos = /\.(png|jpg|gif)$/i;

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre || '');
      setUsername(usuarioActual.username || '');
      setNuevoLinkFoto(usuarioActual.fotoURL || '');
    }
  }, [usuarioActual]);

  const handleGuardarDatos = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await actualizarPerfil({ nombre, username });
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCambiarFotoPorLink = async () => {
    if (!nuevoLinkFoto) return;
    
    if (!formatosValidos.test(nuevoLinkFoto)) {
      alert("Formato no válido. Usa: .png, .jpg o .gif");
      return;
    }

    setIsSubmitting(true);
    try {
      await actualizarPerfil({ nombre, username, fotoURL_nueva: nuevoLinkFoto });
      setShowLinkInput(false);
    } catch (error) {
      console.error("Error al actualizar foto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cargandoAuth || !usuarioActual) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader className="animate-spin text-[#7e1d91]" size={40} />
      </div>
    );
  }

  const fechaFormateada = usuarioActual.fechaCreacion?.toDate 
    ? format(usuarioActual.fechaCreacion.toDate(), 'dd/MM/yyyy') 
    : 'Reciente';

  const inputClass = "w-full px-6 py-4 bg-[#f8f9fa] border-2 border-[#e9ecef] rounded-[22px] focus:outline-none focus:border-[#7e1d91] transition-all font-semibold text-[#3b0f52]";
  const labelClass = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block";

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* CARD DE IDENTIDAD */}
      <div className="bg-white rounded-[45px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-10 mb-8 border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-36 h-36 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-gray-50 flex items-center justify-center">
              {/* Prioriza fotoURL, si no existe o falla, carga FOTO_PREDETERMINADA */}
              <img 
                src={usuarioActual.fotoURL || FOTO_PREDETERMINADA} 
                alt="Perfil" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FOTO_PREDETERMINADA;
                }}
              />
            </div>
            <button 
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`absolute -bottom-2 -right-2 p-3.5 rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white ${showLinkInput ? 'bg-[#3b0f52] text-white' : 'bg-[#7e1d91] text-white'}`}
            >
              {showLinkInput ? <ChevronUp size={20} strokeWidth={3} /> : <Edit2 size={20} strokeWidth={3} />}
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-5xl font-black text-[#3b0f52] italic uppercase tracking-tighter leading-none mb-4">
              {usuarioActual.username || "Usuario"}
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <span className="bg-[#fcfaff] text-[#7e1d91] text-[10px] font-black px-4 py-2 rounded-xl border border-purple-50 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} className="text-[#00d1c4]" /> Miembro desde: {fechaFormateada}
              </span>
            </div>
          </div>
        </div>

        {/* PANEL PARA EL LINK */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showLinkInput ? 'max-h-64 mt-10 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#fcfaff] p-8 rounded-[35px] border-2 border-dashed border-purple-100">
                <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 w-full text-left">
                        <label className={labelClass}>Link de Imagen (png, jpg, gif)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7e1d91] opacity-40" size={18} />
                            <input 
                                type="url" 
                                placeholder="https://ejemplo.com/foto.png"
                                className={`${inputClass} pl-12 bg-white`}
                                value={nuevoLinkFoto}
                                onChange={(e) => setNuevoLinkFoto(e.target.value)}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleCambiarFotoPorLink}
                        disabled={isSubmitting}
                        className="bg-[#00d1c4] text-[#3b0f52] px-8 py-4 rounded-[20px] font-black uppercase italic text-xs tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                    >
                        {isSubmitting ? <Loader className="animate-spin" size={18} /> : "Actualizar"}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* FORMULARIO DE DATOS */}
      <div className="bg-white rounded-[45px] p-10 border border-gray-100 shadow-sm">
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#7e1d91]">
            <padding><User size={24} /></padding>
          </div>
          <h3 className="text-2xl font-black text-[#3b0f52] uppercase italic tracking-tight">Datos de Cuenta</h3>
        </div>

        <form onSubmit={handleGuardarDatos} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <label className={labelClass}>Nombre Completo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="md:col-span-2 w-full bg-[#7e1d91] text-white py-5 rounded-[25px] font-black uppercase italic tracking-widest hover:bg-[#3b0f52] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-purple-100"
          >
            {isSubmitting ? <Loader className="animate-spin" /> : "Actualizar Información"}
          </button>
        </form>
      </div>
    </div>
  );
}