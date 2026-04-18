import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  query, 
  orderBy 
} from "firebase/firestore";
import { 
  Briefcase, MapPin, Clock, Trash2, Plus, 
  Loader, AlignLeft, Send, FileText, 
  Image as ImageIcon, Edit3, X, ListChecks, Info
} from "lucide-react";
import toast from "react-hot-toast";

export default function GestionSubirEmpleo() {
  const [vacantes, setVacantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  
  const estadoInicial = {
    titulo: "",
    descripcion: "", // Corta
    deslarga: "",    // LARGA (De qué va el trabajo)
    requisitos: "",  
    otros: "",       // Horario/Ambiente
    tipo: "Full Time",
    ubicacion: "",
    imagenUrl: ""
  };

  const [form, setForm] = useState(estadoInicial);

  const labelClass = "text-[10px] font-black text-[#3b0f52] uppercase tracking-[0.15em] ml-1 opacity-70";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-white border-2 border-[#f0ebf5] rounded-2xl text-sm text-[#3b0f52] font-semibold transition-all focus:outline-none focus:border-[#7e1d91] focus:ring-4 focus:ring-[#7e1d91]/5 shadow-sm placeholder:text-gray-300";

  const obtenerVacantes = async () => {
    setCargando(true);
    try {
      const q = query(collection(db, "vacantes"), orderBy("titulo", "asc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVacantes(docs);
    } catch (error) {
      toast.error("Error al cargar");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVacantes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.deslarga) {
      return toast.error("¡Faltan campos obligatorios!");
    }

    const toastId = toast.loading(editandoId ? "Actualizando..." : "Publicando...");
    try {
      if (editandoId) {
        await updateDoc(doc(db, "vacantes", editandoId), { ...form });
        toast.success("¡Actualizado con éxito!", { id: toastId });
      } else {
        await addDoc(collection(db, "vacantes"), { ...form, fechaCreacion: new Date() });
        toast.success("¡Publicado con éxito!", { id: toastId });
      }
      cancelarEdicion();
      obtenerVacantes();
    } catch (error) {
      toast.error("Error: " + error.message, { id: toastId });
    }
  };

  const prepararEdicion = (empleo) => {
    setEditandoId(empleo.id);
    setForm({
      titulo: empleo.titulo || "",
      descripcion: empleo.descripcion || "",
      deslarga: empleo.deslarga || "",
      requisitos: empleo.requisitos || "",
      otros: empleo.otros || "",
      tipo: empleo.tipo || "Full Time",
      ubicacion: empleo.ubicacion || "",
      imagenUrl: empleo.imagenUrl || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(estadoInicial);
  };

  const eliminarEmpleo = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar ${nombre}?`)) return;
    try {
      await deleteDoc(doc(db, "vacantes", id));
      toast.success("Eliminado");
      obtenerVacantes();
    } catch (error) {
      toast.error("Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] p-4 md:p-10 space-y-10">
      
      {/* FORMULARIO */}
      <div className={`max-w-4xl mx-auto bg-white rounded-[40px] border-2 transition-all duration-500 p-6 md:p-12 shadow-[0_20px_60px_rgba(59,15,82,0.05)] ${editandoId ? 'border-[#7e1d91]' : 'border-[#f0e6ff]'}`}>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[22px] border-2 ${editandoId ? 'bg-[#7e1d91] text-white border-[#7e1d91]' : 'bg-[#fcfaff] text-[#7e1d91] border-[#f0ebf5]'}`}>
              {editandoId ? <Edit3 size={30} /> : <Plus size={30} />}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-[#3b0f52] uppercase italic tracking-tighter">
                {editandoId ? "Editar Empleo" : "Subir Empleo"}
              </h2>
              <p className={labelClass}>Llenar todos los detalles de la vacante</p>
            </div>
          </div>
          {editandoId && (
            <button onClick={cancelarEdicion} className="px-5 py-2 bg-red-50 text-red-500 rounded-full font-black text-[10px] uppercase border border-red-100">
              Cancelar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className={labelClass}>Título del Puesto</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" className={inputClass} value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" className={inputClass} value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className={labelClass}>URL de Imagen</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" className={inputClass} value={form.imagenUrl} onChange={e => setForm({...form, imagenUrl: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Jornada</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <select className={`${inputClass} appearance-none`} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Prácticas">Prácticas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Descripción Corta (Tarjeta)</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-5 text-gray-300" size={18} />
              <textarea rows="2" className={`${inputClass} pl-12 py-4 resize-none`} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}></textarea>
            </div>
          </div>

          {/* DESLARGA - DESCRIPCION LARGA */}
          <div className="space-y-1">
            <label className={labelClass}>Descripción Larga (De qué va el trabajo)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-5 text-gray-300" size={18} />
              <textarea rows="5" className={`${inputClass} pl-12 py-4 resize-none`} value={form.deslarga} onChange={e => setForm({...form, deslarga: e.target.value})}></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className={labelClass}>Requisitos</label>
              <div className="relative">
                <ListChecks className="absolute left-4 top-5 text-gray-300" size={18} />
                <textarea rows="4" className={`${inputClass} pl-12 py-4 resize-none`} value={form.requisitos} onChange={e => setForm({...form, requisitos: e.target.value})}></textarea>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Horario y Ambiente</label>
              <div className="relative">
                <Info className="absolute left-4 top-5 text-gray-300" size={18} />
                <textarea rows="4" className={`${inputClass} pl-12 py-4 resize-none`} value={form.otros} onChange={e => setForm({...form, otros: e.target.value})}></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-[#7e1d91] text-white rounded-2xl font-black uppercase italic shadow-lg hover:bg-[#3b0f52] transition-all flex items-center justify-center gap-3">
            {editandoId ? "Actualizar Cambios" : "Publicar Ahora"} <Send size={18} />
          </button>
        </form>
      </div>

      {/* LISTADO ABAJO */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 px-2">
        {vacantes.map((job) => (
          <div key={job.id} className="bg-white rounded-[35px] border-2 border-[#f0e6ff] p-5 shadow-sm group">
            <div className="flex justify-between mb-4">
              <div className="p-3 bg-[#fcfaff] rounded-xl text-[#7e1d91] border border-[#f0ebf5]"><Briefcase size={20} /></div>
              <div className="flex gap-1">
                <button onClick={() => prepararEdicion(job)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit3 size={18} /></button>
                <button onClick={() => eliminarEmpleo(job.id, job.titulo)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
              </div>
            </div>
            <h4 className="text-base font-black text-[#3b0f52] uppercase italic mb-2 line-clamp-1">{job.titulo}</h4>
            <p className="text-[11px] text-[#3b0f52]/60 line-clamp-2 mb-4 leading-relaxed">{job.descripcion}</p>
            <div className="pt-3 border-t border-[#fcfaff] flex justify-between items-center opacity-40 italic font-black text-[7px] uppercase">
               <span>ID: {job.id.substring(0,6)}</span>
               <span>Activo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}