import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query 
} from "firebase/firestore";
import { 
  Briefcase, MapPin, Clock, Trash2, Plus, 
  Loader, AlignLeft, Send, AlertCircle,
  ChevronLeft, ChevronRight 
} from "lucide-react";
import toast from "react-hot-toast";

export default function GestionSubirEmpleo() {
  const [vacantes, setVacantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "Full Time",
    ubicacion: ""
  });

  const labelClass = "text-[10px] font-black text-[#3b0f52] uppercase tracking-[0.15em] ml-1 opacity-70";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-white border-2 border-[#f0ebf5] rounded-2xl text-sm text-[#3b0f52] font-semibold transition-all focus:outline-none focus:border-[#7e1d91] shadow-sm placeholder:text-gray-300";

  const obtenerVacantes = async () => {
    setCargando(true);
    try {
      const q = query(collection(db, "vacantes"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      docs.sort((a, b) => (b.fechaCreacion?.seconds || 0) - (a.fechaCreacion?.seconds || 0));
      setVacantes(docs);
    } catch (error) {
      toast.error("Error al cargar empleos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVacantes();
  }, []);

  const totalPages = Math.max(1, Math.ceil(vacantes.length / itemsPerPage));
  const currentVacantes = vacantes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.ubicacion) {
      return toast.error("¡Oye! Completa todos los campos primero");
    }

    const toastId = toast.loading("Publicando...");
    try {
      await addDoc(collection(db, "vacantes"), { ...form, fechaCreacion: new Date() });
      toast.success("¡Empleo publicado!", { id: toastId });
      setForm({ titulo: "", descripcion: "", tipo: "Full Time", ubicacion: "" });
      obtenerVacantes();
    } catch (error) {
      toast.error("Error al subir", { id: toastId });
    }
  };

  const eliminarEmpleo = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await deleteDoc(doc(db, "vacantes", id));
      toast.success("Eliminado");
      obtenerVacantes();
    } catch (error) {
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 space-y-10">
      
      {/* FORMULARIO */}
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] border-2 border-[#f0e6ff] p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-white rounded-[22px] border-2 border-[#f0ebf5] text-[#7e1d91]">
            <Plus size={30} />
          </div>
          <h2 className="text-3xl font-black text-[#3b0f52] uppercase italic tracking-tighter">Publicar Empleo</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Puesto</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" className={inputClass} value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ej. UX Designer" />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" className={inputClass} value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} placeholder="Ej. Remoto" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Jornada</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <select className={`${inputClass} appearance-none`} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Remoto">Remoto</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-[#7e1d91] text-white py-4 rounded-2xl font-black uppercase italic shadow-lg hover:bg-[#3b0f52] transition-all flex items-center justify-center gap-3">
                Subir Empleo <Send size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Descripción</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-5 text-gray-300" size={18} />
              <textarea rows="4" className={`${inputClass} pl-12 py-4 resize-none`} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Detalles del puesto..."></textarea>
            </div>
          </div>
        </form>
      </div>

      {/* LISTA (MAX 6) */}
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <h3 className="text-xl font-black text-[#3b0f52] uppercase italic px-4">Empleos activos ({vacantes.length})</h3>

        {cargando ? (
          <div className="text-center py-20"><Loader className="animate-spin mx-auto text-[#7e1d91]" size={40} /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVacantes.map((job) => (
                <div key={job.id} className="bg-white rounded-[35px] border-2 border-[#f0e6ff] p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white rounded-2xl text-[#7e1d91] border border-[#f0ebf5]"><Briefcase size={22} /></div>
                    <button onClick={() => eliminarEmpleo(job.id, job.titulo)} className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                  </div>
                  <h4 className="text-xl font-black text-[#3b0f52] uppercase italic mb-4">{job.titulo}</h4>
                  <p className="text-xs text-[#3b0f52]/60 line-clamp-3 mb-4 leading-relaxed">{job.descripcion}</p>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[8px] font-black text-gray-300 italic">
                    <span>REF: {job.id.substring(0,8)}</span>
                    <span className="text-[#00d1c4]">ACTIVO</span>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-3 rounded-full bg-white border text-[#7e1d91] disabled:opacity-20 shadow-sm"><ChevronLeft size={20}/></button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-black italic text-xs ${currentPage === i+1 ? 'bg-[#7e1d91] text-white shadow-lg' : 'bg-white text-gray-400 border'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border text-[#7e1d91] disabled:opacity-20 shadow-sm"><ChevronRight size={20}/></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}