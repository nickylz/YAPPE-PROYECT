import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import {
  Search,
  FileText,
  Loader2,
  User,
  Phone,
  Tag,
  ChevronLeft,
  ChevronRight,
  Mail,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function GestionPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(
    typeof window !== "undefined" && window.innerWidth >= 768 ? 9 : 6,
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 9 : 6);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let unsubscribe = null;

    const inicializarDatos = async () => {
      try {
        const vacantesSnap = await getDocs(collection(db, "vacantes"));
        const mapaPuestos = {};
        vacantesSnap.forEach((doc) => {
          mapaPuestos[doc.id] = doc.data().titulo;
        });

        const q = query(
          collection(db, "postulaciones"),
          orderBy("fecha", "desc"),
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const docs = snapshot.docs.map((doc) => {
              const data = doc.data();

              const nombreEncontrado =
                mapaPuestos[data.puestoId] ||
                data.puesto ||
                data.puestoId ||
                "Puesto Desconocido";

              return {
                id: doc.id,
                ...data,
                puestoVisual: nombreEncontrado,
              };
            });
            setPostulaciones(docs);
            setLoading(false);
          },
          (error) => {
            console.error("Error en snapshot:", error);
            toast.error("Error al sincronizar datos");
            setLoading(false);
          },
        );
      } catch (error) {
        console.error("Error crítico inicializando:", error);
        setLoading(false);
      }
    };

    inicializarDatos();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const actualizarEstado = async (id, nuevoEstado) => {
    const toastId = toast.loading("Actualizando...");
    try {
      await updateDoc(doc(db, "postulaciones", id), { estado: nuevoEstado });
      toast.success(`Estado: ${nuevoEstado}`, { id: toastId });
    } catch (e) {
      toast.error("Error al actualizar", { id: toastId });
    }
  };

  const filtrados = postulaciones.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
      p.nombrePostulante?.toLowerCase().includes(term) ||
      p.puestoVisual?.toLowerCase().includes(term) ||
      p.correo?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const currentItems = filtrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-[#7e1d91]" size={40} />
        <p className="mt-4 font-black text-[#3b0f52] italic uppercase text-sm tracking-tighter">
          Sincronizando Postulaciones...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o puesto..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#fcfaff] border border-[#ecd8ff] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/10"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="hidden md:block">
          <p className="text-[10px] font-black text-[#7e1d91]/40 uppercase tracking-widest italic">
            {filtrados.length} Postulaciones en total
          </p>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-[#ecd8ff] p-12 text-center">
          <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="font-black text-[#3b0f52] uppercase italic text-sm">
            Sin resultados
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[2.5rem] border border-[#ecd8ff] shadow-sm overflow-hidden">
            <div className="divide-y divide-[#f7f1ff]">
              {currentItems.map((p) => {
                const isExpanded = expandedId === p.id;
                return (
                  <div
                    key={p.id}
                    className="group transition-colors hover:bg-[#fcfaff]/40"
                  >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-[#7e1d91] text-white rounded-[20px] flex items-center justify-center font-black text-xl shadow-lg shadow-[#7e1d91]/20 italic shrink-0">
                          {p.nombrePostulante?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-[#3b0f52] text-base uppercase italic truncate">
                            {p.nombrePostulante}
                          </p>
                          <p className="text-[11px] text-[#7e1d91]/60 font-bold truncate">
                            {p.correo}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-gray-300 uppercase mb-1">
                            Puesto
                          </p>
                          <p className="text-xs font-black text-[#7e1d91] uppercase italic">
                            {p.puestoVisual}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-gray-300 uppercase mb-1">
                            Estado
                          </p>
                          <span
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${
                              p.estado === "Aceptado"
                                ? "bg-emerald-100 text-emerald-600"
                                : p.estado === "Denegado"
                                  ? "bg-red-100 text-red-600"
                                  : p.estado === "Procesado"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {p.estado || "Recibido"}
                          </span>
                        </div>
                      </div>

                      <div className="md:w-44 flex md:justify-end">
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : p.id)
                          }
                          className={`w-full md:w-auto px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                            isExpanded
                              ? "bg-[#3b0f52] text-white border-[#3b0f52]"
                              : "bg-white text-[#7e1d91] border-[#ecd8ff] hover:bg-[#fcfaff]"
                          }`}
                        >
                          {isExpanded ? "Cerrar" : "Ver Detalles"}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-8 md:px-20 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-[#fcfaff] rounded-[2.5rem] border border-[#ecd8ff] p-6 md:p-10 grid md:grid-cols-2 gap-8">
                          <div className="space-y-5">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-white rounded-lg border border-[#f7f1ff]">
                                <Phone size={16} className="text-[#7e1d91]" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase">
                                  Teléfono
                                </p>
                                <p className="font-bold text-[#3b0f52]">
                                  {p.celular || "Sin número"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-white rounded-lg border border-[#f7f1ff]">
                                <Tag size={16} className="text-[#7e1d91]" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase">
                                  Puesto ID
                                </p>
                                <p className="font-black text-[#7e1d91] uppercase italic">
                                  {p.puestoVisual}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col justify-center gap-4">
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() =>
                                  actualizarEstado(p.id, "Procesado")
                                }
                                className="p-3 bg-white border border-blue-100 text-blue-500 rounded-xl text-[8px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all"
                              >
                                Procesar
                              </button>
                              <button
                                onClick={() =>
                                  actualizarEstado(p.id, "Aceptado")
                                }
                                className="p-3 bg-white border border-emerald-100 text-emerald-500 rounded-xl text-[8px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={() =>
                                  actualizarEstado(p.id, "Denegado")
                                }
                                className="p-3 bg-white border border-red-100 text-red-500 rounded-xl text-[8px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                              >
                                Denegar
                              </button>
                            </div>
                            {p.cvUrl && (
                              <a
                                href={p.cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-[#7e1d91] text-white rounded-2xl text-[10px] font-black uppercase italic shadow-lg shadow-[#7e1d91]/20 hover:scale-[1.01] transition-transform"
                              >
                                <FileText size={16} /> Ver Currículum Vitae{" "}
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center pt-8 gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white border border-[#ecd8ff] text-[#7e1d91] shadow-sm disabled:opacity-30 transition-all hover:bg-[#fcfaff]"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex bg-white rounded-2xl border border-[#ecd8ff] p-1 shadow-sm overflow-x-auto">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                      currentPage === i + 1
                        ? "bg-[#7e1d91] text-white shadow-lg shadow-[#7e1d91]/20"
                        : "text-[#7e1d91]/40 hover:text-[#7e1d91] hover:bg-[#fcfaff]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white border border-[#ecd8ff] text-[#7e1d91] shadow-sm disabled:opacity-30 transition-all hover:bg-[#fcfaff]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
