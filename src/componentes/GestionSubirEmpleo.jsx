import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Trash2, 
  Plus, 
  Loader, 
  AlignLeft, 
  Send, 
  AlertCircle 
} from "lucide-react";
import toast from "react-hot-toast";

export default function GestionSubirEmpleo() {
  const [vacantes, setVacantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para el formulario de subida
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "Full Time",
    ubicacion: ""
  });

  // Clases de estilo extraídas de tu línea gráfica
  const labelClass = "text-[10px] font-black text-[#3b0f52] uppercase tracking-[0.15em] ml-1 opacity-70";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-white border-2 border-[#f0ebf5] rounded-2xl text-sm text-[#3b0f52] font-semibold transition-all focus:outline-none focus:border-[#7e1d91] focus:ring-4 focus:ring-[#7e1d91]/5 shadow-sm placeholder:text-gray-300";

  // Función para obtener los empleos de la base de datos
  const obtenerVacantes = async () => {
    setCargando(true);
    try {
      const q = query(collection(db, "vacantes"), orderBy("titulo", "asc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVacantes(docs);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los empleos activos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVacantes();
  }, []);

  // Función para subir el nuevo empleo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.ubicacion) {
      return toast.error("¡Oye! Completa todos los campos primero");
    }

    const toastId = toast.loading("Publicando empleo...");
    try {
      await addDoc(collection(db, "vacantes"), {
        ...form,
        fechaCreacion: new Date()
      });
      toast.success("¡Empleo publicado con éxito!", { id: toastId });
      // Limpiar formulario
      setForm({ titulo: "", descripcion: "", tipo: "Full Time", ubicacion: "" });
      obtenerVacantes(); // Refrescar lista
    } catch (error) {
      toast.error("Hubo un error al subir: " + error.message, { id: toastId });
    }
  };

  // Función para borrar un empleo
  const eliminarEmpleo = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la vacante de "${nombre}"?`)) return;

    try {
      await deleteDoc(doc(db, "vacantes", id));
      toast.success("Empleo eliminado correctamente");
      obtenerVacantes();
    } catch (error) {
      toast.error("No se pudo eliminar el empleo");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] p-4 md:p-10 space-y-10">
      
      {/* SECCIÓN DE SUBIDA (FORMULARIO) */}
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] border-2 border-[#f0e6ff] p-8 md:p-12 shadow-[0_20px_60px_rgba(59,15,82,0.05)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[#fcfaff] rounded-[22px] border-2 border-[#f0ebf5] text-[#7e1d91]">
            <Plus size={30} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#3b0f52] uppercase italic tracking-tighter">Publicar Nuevo Empleo</h2>
            <p className={labelClass}>Gestión interna de vacantes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Puesto */}
            <div className="space-y-1">
              <label className={labelClass}>Nombre del Puesto</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Ej. Asesor de Ventas" 
                  className={inputClass}
                  value={form.titulo} 
                  onChange={e => setForm({...form, titulo: e.target.value})}
                />
              </div>
            </div>

            {/* Lugar */}
            <div className="space-y-1">
              <label className={labelClass}>Lugar / Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Ej. Lima, Perú (Presencial)" 
                  className={inputClass}
                  value={form.ubicacion} 
                  onChange={e => setForm({...form, ubicacion: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Empleo */}
            <div className="space-y-1">
              <label className={labelClass}>Tipo de Jornada</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <select 
                  className={`${inputClass} appearance-none cursor-pointer`}
                  value={form.tipo} 
                  onChange={e => setForm({...form, tipo: e.target.value})}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Prácticas">Prácticas</option>
                </select>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full bg-[#7e1d91] text-white py-4 rounded-2xl font-black uppercase italic text-sm tracking-[0.2em] shadow-lg shadow-[#7e1d91]/20 hover:bg-[#3b0f52] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Subir Empleo <Send size={18} />
              </button>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className={labelClass}>Descripción y Requisitos</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-5 text-gray-300" size={18} />
              <textarea 
                rows="4" 
                placeholder="Describe brevemente de qué trata el empleo..." 
                className={`${inputClass} pl-12 py-4 resize-none`}
                value={form.descripcion} 
                onChange={e => setForm({...form, descripcion: e.target.value})}
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      {/* SECCIÓN DE BORRADO (LISTA) */}
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xl font-black text-[#3b0f52] uppercase italic tracking-widest">Empleos en la web</h3>
          <span className="bg-[#7e1d91] text-white px-4 py-1 rounded-full text-[10px] font-black italic">
            {vacantes.length} PUBLICADOS
          </span>
        </div>

        {cargando ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto text-[#7e1d91]" size={40} />
          </div>
        ) : vacantes.length === 0 ? (
          <div className="bg-white rounded-[30px] p-12 text-center border-2 border-dashed border-[#f0ebf5]">
            <AlertCircle className="mx-auto text-gray-200 mb-4" size={50} />
            <p className="font-bold text-[#3b0f52]/40 uppercase text-xs italic tracking-widest">No hay empleos activos en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vacantes.map((job) => (
              <div key={job.id} className="bg-white rounded-[35px] border-2 border-[#f0e6ff] p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#fcfaff] rounded-2xl text-[#7e1d91] border border-[#f0ebf5]">
                    <Briefcase size={22} />
                  </div>
                  <button 
                    onClick={() => eliminarEmpleo(job.id, job.titulo)}
                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all active:scale-90"
                    title="Eliminar empleo"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <h4 className="text-lg font-black text-[#3b0f52] uppercase italic leading-tight mb-2 group-hover:text-[#7e1d91] transition-colors">
                  {job.titulo}
                </h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 text-[9px] font-black text-[#7e1d91] bg-purple-50 px-3 py-1 rounded-full border border-purple-100 uppercase italic">
                    <Clock size={12} /> {job.tipo}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase italic">
                    <MapPin size={12} /> {job.ubicacion}
                  </span>
                </div>

                <p className="text-xs text-[#3b0f52]/60 line-clamp-3 font-medium mb-2 leading-relaxed">
                  {job.descripcion}
                </p>

                <div className="pt-4 mt-2 border-t border-[#fcfaff] flex justify-between items-center">
                   <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter italic">ID: {job.id.substring(0,8)}</span>
                   <span className="text-[8px] font-black text-[#00d1c4] uppercase italic">Activo en web</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}