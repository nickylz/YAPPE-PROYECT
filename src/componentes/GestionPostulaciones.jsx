import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, query, onSnapshot, doc, 
  updateDoc, getDocs, deleteDoc 
} from "firebase/firestore";
import { 
  Search, Loader2, User, Mail, Phone, 
  Trash2, Briefcase, ChevronLeft, ChevronRight, ExternalLink 
} from "lucide-react";
import toast from "react-hot-toast";

export default function GestionPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [vacantes, setVacantes] = useState({});
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const cargarNombresPuestos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vacantes"));
        const mapa = {};
        snapshot.forEach(d => {
          mapa[d.id] = d.data().puesto || d.data().titulo || "Puesto sin nombre";
        });
        setVacantes(mapa);
      } catch (e) {
        console.error("Error cargando nombres:", e);
      }
    };

    cargarNombresPuestos();

    const q = query(collection(db, "postulaciones"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPostulaciones(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "postulaciones", id), { estado: nuevoEstado });
      toast.success("Estado actualizado");
    } catch (e) {
      toast.error("Error al actualizar");
    }
  };

  const eliminarPostulacion = async (id) => {
    if (window.confirm("¿Deseas eliminar esta postulación?")) {
      try {
        await deleteDoc(doc(db, "postulaciones", id));
        toast.success("Eliminado");
      } catch (e) {
        toast.error("Error al eliminar");
      }
    }
  };

  const filtrados = postulaciones.filter(p => {
    const nombrePuesto = vacantes[p.vacanteId] || "Cargando...";
    return (
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      nombrePuesto.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const currentItems = filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#7e1d91]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-6 py-10 pb-40">
      <div className="max-w-[1440px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#f0ebf5] pb-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic text-[#3b0f52] uppercase">
              Gestión de <span className="text-[#7e1d91]">Postulaciones</span>
            </h1>
            <p className="text-gray-400 font-bold text-[10px] tracking-[0.4em]">Panel Admin</p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7e1d91]/30" size={20} />
            <input 
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setCurrentPage(1); }}
              className="w-full pl-14 pr-6 py-4 rounded-3xl bg-[#fcfaff] border-2 border-[#ecd8ff]"
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((p) => {

            const puesto = vacantes[p.vacanteId] || "Puesto no identificado";
            const isExpanded = expandedId === p.id;

            return (
              <div key={p.id} className="bg-white border-2 rounded-[2rem] p-6 shadow-sm">

                <div className="flex justify-between">
                  <User />
                  <span className="text-xs font-bold">{p.estado}</span>
                </div>

                <h3 className="font-bold mt-3">{p.nombre}</h3>
                <p className="text-xs text-purple-700">{puesto}</p>

                <div className="text-xs mt-2">
                  <p>{p.email}</p>
                  <p>{p.celular}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => setExpandedId(isExpanded ? null : p.id)} className="flex-1 bg-purple-700 text-white py-2 rounded">
                    {isExpanded ? "Cerrar" : "Gestionar"}
                  </button>

                  <button onClick={() => eliminarPostulacion(p.id)} className="bg-red-500 text-white px-3 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-2">

                    <button onClick={() => actualizarEstado(p.id, "Aceptado")} className="w-full bg-green-500 text-white py-2 rounded">
                      Aceptar
                    </button>

                    <button onClick={() => actualizarEstado(p.id, "Denegado")} className="w-full bg-red-500 text-white py-2 rounded">
                      Denegar
                    </button>

                    {/* 🔥 FIX AQUÍ */}
                    <a 
                      href={p.cvUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex justify-center items-center gap-2 bg-purple-700 text-white py-2 rounded"
                    >
                      Ver CV <ExternalLink size={14} />
                    </a>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 pt-10">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              <ChevronLeft />
            </button>

            <span>{currentPage} / {totalPages}</span>

            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              <ChevronRight />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}