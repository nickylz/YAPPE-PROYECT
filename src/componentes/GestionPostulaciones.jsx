import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
// Importamos getDocs para traer la lista de vacantes una sola vez
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
import { 
  Search, FileText, Clock, CheckCircle, 
  XCircle, Loader2, Eye, X, User, Mail, Phone, Tag,
  ChevronLeft, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function GestionPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [vacantes, setVacantes] = useState({}); // Diccionario para buscar: { id: nombre_puesto }
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // 1. Primero traemos todas las vacantes para tener los nombres de los puestos
    const obtenerVacantes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vacantes"));
        const mapaVacantes = {};
        querySnapshot.forEach((doc) => {
          mapaVacantes[doc.id] = doc.data().titulo; // Guardamos ID -> Título
        });
        setVacantes(mapaVacantes);
      } catch (error) {
        console.error("Error al traer nombres de puestos:", error);
      }
    };

    obtenerVacantes();

    // 2. Escuchamos las postulaciones en tiempo real
    const q = query(collection(db, "postulaciones"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPostulaciones(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "postulaciones", id), { estado: nuevoEstado });
      toast.success(`Estado: ${nuevoEstado}`);
    } catch (e) { toast.error("Error al actualizar"); }
  };

  // Filtrado considerando que ahora buscamos por el NOMBRE del puesto traducido
  const filtrados = postulaciones.filter(p => {
    const nombrePuesto = vacantes[p.puestoId] || p.puesto || "Puesto no encontrado";
    return (
      p.nombrePostulante?.toLowerCase().includes(busqueda.toLowerCase()) ||
      nombrePuesto.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const itemsPerPage = 8;
  const currentItems = filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#7e1d91]" size={40}/></div>;

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative w-full md:max-w-md mx-auto md:mx-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input 
          type="text" placeholder="Buscar por nombre o puesto..." 
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#fcfaff] border border-[#ecd8ff] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/10"
          onChange={(e) => { setBusqueda(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#ecd8ff] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#f7f1ff]">
          {currentItems.map((p) => {
            // BUSCAMOS EL NOMBRE DEL PUESTO USANDO EL ID
            const nombreDelPuesto = vacantes[p.puestoId] || p.puesto || "Cargando puesto...";

            return (
              <div key={p.id} className="group">
                {/* FILA PRINCIPAL (Desktop: Llena / Mobile: Botón Abajo) */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-[#7e1d91] text-white rounded-[20px] flex items-center justify-center font-black text-xl shadow-lg shadow-[#7e1d91]/20 italic shrink-0">
                      {p.nombrePostulante?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-[#3b0f52] text-base uppercase italic truncate">{p.nombrePostulante}</p>
                      <p className="text-[11px] text-[#7e1d91]/60 font-bold truncate lowercase">{p.correo}</p>
                    </div>
                  </div>

                  {/* INFO DESKTOP: Ahora muestra el nombre real del puesto */}
                  <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Puesto</p>
                        <p className="text-xs font-black text-[#7e1d91] uppercase italic">{nombreDelPuesto}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Estado</p>
                        <span className={`text-[10px] font-black uppercase ${p.estado === 'Aceptado' ? 'text-emerald-500' : 'text-blue-500'}`}>
                          {p.estado || "Enviado"}
                        </span>
                     </div>
                  </div>

                  {/* BOTÓN ABAJO EN RESPONSIVE */}
                  <div className="md:w-40 flex md:justify-end">
                    <button 
                      onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      className={`w-full md:w-auto px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        expandedId === p.id ? 'bg-[#3b0f52] text-white' : 'bg-white text-[#7e1d91] border-[#ecd8ff]'
                      }`}
                    >
                      {expandedId === p.id ? "Cerrar" : "Ver Detalles"}
                    </button>
                  </div>
                </div>

                {/* MODAL DETALLES */}
                {expandedId === p.id && (
                  <div className="px-6 pb-8 md:px-20 animate-in slide-in-from-top-4">
                    <div className="bg-[#fcfaff] rounded-[2rem] border border-[#ecd8ff] p-6 md:p-10 grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-[#7e1d91]"/>
                          <p className="text-xs font-black text-[#3b0f52] uppercase">{p.nombrePostulante}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-[#7e1d91]"/>
                          <p className="font-bold text-[#3b0f52]">{p.celular || "No registrado"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Tag size={16} className="text-[#7e1d91]"/>
                          <p className="font-black text-[#7e1d91] uppercase italic">{nombreDelPuesto}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => actualizarEstado(p.id, "Procesado")} className="p-3 bg-white border border-blue-100 text-blue-500 rounded-xl text-[8px] font-black uppercase">Procesar</button>
                          <button onClick={() => actualizarEstado(p.id, "Aceptado")} className="p-3 bg-white border border-emerald-100 text-emerald-500 rounded-xl text-[8px] font-black uppercase">Aceptar</button>
                          <button onClick={() => actualizarEstado(p.id, "Denegado")} className="p-3 bg-white border border-red-100 text-red-500 rounded-xl text-[8px] font-black uppercase">Denegar</button>
                        </div>
                        <a href={p.cvUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-4 bg-[#7e1d91] text-white rounded-2xl text-[10px] font-black uppercase italic shadow-lg">
                          <FileText size={16}/> Abrir CV
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}