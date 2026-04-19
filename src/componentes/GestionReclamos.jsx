import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Loader,
  Mail,
  User,
  FileText,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Send,
  CheckCircle2,
  Search,
  Filter,
  MessageSquare,
  Trash2,
  Archive,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const ReclamoDetailModal = ({
  reclamo,
  onClose,
  respuesta,
  setRespuesta,
  estado,
  setEstado,
  onEnviar,
  enviando,
}) => {
  if (!reclamo) return null;

  const estados = [
    {
      id: "pendiente",
      label: "Pendiente",
      icon: <Clock size={16} />,
      color: "bg-amber-100 text-amber-600 border-amber-200",
    },
    {
      id: "respondido",
      label: "Resuelto",
      icon: <CheckCircle2 size={16} />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
    },
    {
      id: "archivado",
      label: "Archivado",
      icon: <Archive size={16} />,
      color: "bg-slate-100 text-slate-600 border-slate-200",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-[#3b0f52]/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#7e1d91] p-8 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
              Atención al Cliente
            </span>
            <h2 className="text-2xl font-black italic mt-1 uppercase">
              Detalle de Incidencia
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-8 lg:p-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em] flex items-center gap-2">
                <FileText size={14} /> Datos del Registro
              </h3>
              <div className="space-y-3">
                <div className="bg-[#fcfaff] p-5 rounded-4xl border border-[#ecd8ff]">
                  <p className="text-[9px] font-black text-[#7e1d91]/40 uppercase tracking-widest">
                    Remitente
                  </p>
                  <p className="text-sm text-[#3b0f52] font-black uppercase italic">
                    {reclamo.nombres} {reclamo.apellidos}
                  </p>
                </div>
                <div className="bg-[#fcfaff] p-5 rounded-4xl border border-[#ecd8ff]">
                  <p className="text-[9px] font-black text-[#7e1d91]/40 uppercase tracking-widest">
                    Contacto
                  </p>
                  <p className="text-sm text-[#3b0f52] font-bold lowercase">
                    {reclamo.correo}
                  </p>
                </div>
                <div className="bg-[#fcfaff] p-6 rounded-[2.5rem] border border-[#ecd8ff] shadow-inner">
                  <p className="text-[9px] font-black text-[#7e1d91]/40 uppercase tracking-widest mb-2">
                    Comentario del Cliente
                  </p>
                  <p className="text-sm text-[#3b0f52] font-bold leading-relaxed italic">
                    "{reclamo.comentario}"
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em] mb-4">
                  Actualizar Estado
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {estados.map((est) => (
                    <button
                      key={est.id}
                      onClick={() => setEstado(est.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                        estado === est.id
                          ? "border-[#7e1d91] bg-[#fcfaff] shadow-sm"
                          : "border-transparent bg-gray-50 text-gray-400"
                      }`}
                    >
                      {est.icon}
                      <span className="text-[8px] font-black uppercase">
                        {est.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={onEnviar} className="space-y-4">
                <h3 className="text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em] flex items-center gap-2">
                  <MessageSquare size={14} /> Respuesta Administrativa
                </h3>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  className="w-full h-40 bg-[#fcfaff] border-2 border-[#ecd8ff] rounded-4xl p-6 text-sm focus:outline-none focus:border-[#7e1d91] transition-all resize-none font-bold text-[#3b0f52]"
                  placeholder="Escribe aquí la solución..."
                  required
                />
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-[#7e1d91] text-white py-5 rounded-4xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#3b0f52] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {enviando ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={16} /> Guardar Cambios
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GestionReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [enviando, setEnviando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // <--- Cambiado a 5 registros por página

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "reclamos"),
        orderBy("fechaCreacion", "desc"),
      );
      const snap = await getDocs(q);
      setReclamos(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          fechaFormateada: doc.data().fechaCreacion?.toDate(),
        })),
      );
    } catch (err) {
      toast.error("Error al conectar con Firebase");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const docRef = doc(db, "reclamos", selectedReclamo.id);
      await updateDoc(docRef, {
        respuestaAdmin: respuesta,
        estado: estado,
        fechaRespuesta: new Date(),
      });
      toast.success("Registro actualizado");
      setSelectedReclamo(null);
      fetchData();
    } catch (err) {
      toast.error("Error al guardar");
    } finally {
      setEnviando(false);
    }
  };

  const filtrados = reclamos.filter((r) => {
    const searchStr = (r.nombres + r.apellidos + r.correo).toLowerCase();
    const matchesSearch = searchStr.includes(busqueda.toLowerCase());
    const matchesStatus = filtroEstado === "todos" || r.estado === filtroEstado;
    return matchesSearch && matchesStatus;
  });

  const totalPaginas = Math.ceil(filtrados.length / itemsPerPage);
  const itemsActuales = filtrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const StatusBadge = ({ status }) => (
    <span
      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic border-2 ${
        status === "respondido"
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : status === "archivado"
            ? "bg-gray-50 text-gray-500 border-gray-100"
            : "bg-amber-50 text-amber-500 border-amber-100"
      }`}
    >
      {status || "pendiente"}
    </span>
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader className="animate-spin text-[#7e1d91]" size={40} />
        <p className="text-[#3b0f52] font-black uppercase tracking-[0.3em] text-[10px] italic">
          Sincronizando Libro...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* HEADER TIPO USUARIOS */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-[#ecd8ff]/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]/30"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por cliente o correo..."
            className="w-full pl-16 pr-8 py-4 rounded-full bg-[#fcfaff] border-2 border-transparent focus:border-[#ecd8ff] font-bold text-sm outline-none transition-all"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="flex-1 md:flex-none pl-6 pr-10 py-4 rounded-full bg-[#fcfaff] border-2 border-transparent font-black text-[11px] uppercase tracking-widest text-[#3b0f52] outline-none cursor-pointer"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="respondido">Resueltos</option>
            <option value="archivado">Archivados</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-[#ecd8ff] shadow-xl overflow-hidden min-h-[400px]">
        <div className="md:hidden p-5 space-y-4">
          {itemsActuales.map((r) => (
            <div
              key={r.id}
              className="bg-[#fcfaff] rounded-[2.5rem] border border-[#ecd8ff]/40 p-6 space-y-4 relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7e1d91] text-white rounded-[18px] flex items-center justify-center font-black italic">
                  {r.nombres[0]}
                  {r.apellidos[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-[#3b0f52] uppercase italic text-sm truncate">
                    {r.nombres} {r.apellidos}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {r.fechaFormateada
                      ? format(r.fechaFormateada, "dd/MM/yyyy")
                      : "S/F"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#ecd8ff]/30">
                <StatusBadge status={r.estado} />
                <button
                  onClick={() => {
                    setSelectedReclamo(r);
                    setRespuesta(r.respuestaAdmin || "");
                    setEstado(r.estado || "pendiente");
                  }}
                  className="p-3 bg-white border border-[#ecd8ff] text-[#7e1d91] rounded-2xl shadow-sm active:scale-90 transition-all"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fcfaff] border-b border-[#f0e4ff]">
                <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-left">
                  Cliente
                </th>
                <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-center">
                  Estado
                </th>
                <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-left">
                  Fecha
                </th>
                <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f1ff]">
              {itemsActuales.map((r) => (
                <tr
                  key={r.id}
                  className="group hover:bg-[#fcfaff]/50 transition-all"
                >
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#3b0f52] text-white rounded-[15px] flex items-center justify-center font-black text-xs italic">
                        {r.nombres[0]}
                        {r.apellidos[0]}
                      </div>
                      <span className="font-black text-[#3b0f52] text-sm uppercase italic">
                        {r.nombres}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-5 text-center">
                    <StatusBadge status={r.estado} />
                  </td>
                  <td className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase italic">
                    {r.fechaFormateada
                      ? format(r.fechaFormateada, "dd MMM, yyyy")
                      : "---"}
                  </td>
                  <td className="px-10 py-5 text-right">
                    <button
                      onClick={() => {
                        setSelectedReclamo(r);
                        setRespuesta(r.respuestaAdmin || "");
                        setEstado(r.estado || "pendiente");
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#7e1d91] text-[#7e1d91] rounded-2xl text-[10px] font-black uppercase italic hover:bg-[#7e1d91] hover:text-white transition-all shadow-sm"
                    >
                      <Eye size={14} /> Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 rounded-full bg-white text-[#7e1d91] border border-[#f0e4ff] shadow-md flex items-center justify-center disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 bg-white p-2 rounded-[20px] border border-[#f0e4ff] shadow-sm">
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black italic text-xs transition-all ${
                  currentPage === i + 1
                    ? "bg-[#7e1d91] text-white shadow-lg"
                    : "text-gray-400 hover:text-[#7e1d91]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={currentPage === totalPaginas}
            className="w-12 h-12 rounded-full bg-white text-[#7e1d91] border border-[#f0e4ff] shadow-md flex items-center justify-center disabled:opacity-20 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <ReclamoDetailModal
        reclamo={selectedReclamo}
        onClose={() => setSelectedReclamo(null)}
        respuesta={respuesta}
        setRespuesta={setRespuesta}
        estado={estado}
        setEstado={setEstado}
        onEnviar={handleUpdate}
        enviando={enviando}
      />
    </div>
  );
}
