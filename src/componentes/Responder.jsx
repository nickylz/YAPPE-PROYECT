import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { 
  MessageSquare, Clock, CheckCircle2, 
  Inbox, Briefcase, XCircle, 
  Bell, ChevronLeft, ChevronRight, Sparkles 
} from "lucide-react";

export default function Responder() {
  const { usuarioActual } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [vacantes, setVacantes] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reclamos");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!usuarioActual?.email) return;

    const fetchData = async () => {
      try {
        const qV = await getDocs(collection(db, "vacantes"));
        const mapa = {};
        qV.forEach(doc => mapa[doc.id] = doc.data().titulo);
        setVacantes(mapa);

        const qReclamos = query(
          collection(db, "reclamos"),
          where("correo", "==", usuarioActual.email)
        );

        const qPostulaciones = query(
          collection(db, "postulaciones"),
          where("email", "==", usuarioActual.email)
        );

        const unsubReclamos = onSnapshot(qReclamos, (snap) => {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => (b.fechaCreacion?.seconds || 0) - (a.fechaCreacion?.seconds || 0));
          setReclamos(data);
          setLoading(false);
        });

        const unsubPostulaciones = onSnapshot(qPostulaciones, (snap) => {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => {
            const dateA = a.fecha?.seconds ? a.fecha.toDate() : new Date(a.fecha || 0);
            const dateB = b.fecha?.seconds ? b.fecha.toDate() : new Date(b.fecha || 0);
            return dateB - dateA;
          });
          setPostulaciones(data);
        });

        return () => {
          unsubReclamos();
          unsubPostulaciones();
        };
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [usuarioActual]);

  const currentItems = activeTab === "reclamos" ? reclamos : postulaciones;
  const totalPages = Math.max(1, Math.ceil(currentItems.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const visibleItems = currentItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getStatusBadge = (estado) => {
    const s = estado?.toLowerCase();
    const baseClass = "px-3 py-1 md:px-4 md:py-1.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-sm";
    
    if (s === 'aceptado' || s === 'respondido') 
      return <span className={`${baseClass} bg-emerald-50 text-emerald-500 border border-emerald-100`}><CheckCircle2 size={12}/> ¡Listo!</span>;
    if (s === 'denegado') 
      return <span className={`${baseClass} bg-red-50 text-red-400 border border-red-100`}><XCircle size={12}/> Finalizado</span>;
    
    return <span className={`${baseClass} bg-amber-50 text-amber-500 border border-amber-100`}><Clock size={12}/> Pendiente</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-16 h-16 border-4 border-[#7e1d91]/10 border-t-[#7e1d91] rounded-full animate-spin"></div>
        <p className="text-[#3b0f52] font-black uppercase text-[10px] tracking-[0.3em]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-10">
      {/* HEADER RESPONSIVE */}
      <div className="relative bg-white rounded-[35px] md:rounded-[50px] p-6 md:p-10 mb-6 md:mb-10 shadow-xl border border-purple-50 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-[#7e1d91] rounded-[25px] md:rounded-[35px] flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
                <Inbox size={32} className="md:w-10 md:h-10" strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-[#3b0f52] italic uppercase tracking-tighter leading-none mb-2">Mis Respuestas</h1>
                <p className="text-[#6b4a88] font-semibold opacity-50 text-[10px] md:text-sm tracking-wide uppercase">Gestiona tus trámites</p>
            </div>
        </div>
      </div>

      {/* TABS RESPONSIVE */}
      <div className="flex bg-white p-1.5 md:p-2.5 rounded-[25px] md:rounded-[35px] shadow-sm border border-gray-100 mb-6 md:mb-10">
        <button 
          onClick={() => changeTab("reclamos")} 
          className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-5 rounded-[20px] md:rounded-[28px] font-black uppercase italic text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'reclamos' ? 'bg-[#7e1d91] text-white shadow-lg' : 'text-gray-400'}`}
        >
          <MessageSquare size={16} className="md:w-5 md:h-5"/> Reclamos
        </button>
        <button 
          onClick={() => changeTab("empleo")} 
          className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-5 rounded-[20px] md:rounded-[28px] font-black uppercase italic text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'empleo' ? 'bg-[#7e1d91] text-white shadow-lg' : 'text-gray-400'}`}
        >
          <Briefcase size={16} className="md:w-5 md:h-5"/> Empleo
        </button>
      </div>

      {/* LISTADO RESPONSIVE */}
      <div className="space-y-4 md:space-y-6 min-h-[300px]">
        {visibleItems.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white rounded-[35px] border-2 border-dashed border-gray-100">
              <p className="text-gray-300 font-black uppercase italic text-[10px] tracking-widest">Sin registros</p>
          </div>
        ) : (
          visibleItems.map(item => (
            <div key={item.id} className="bg-white rounded-[30px] md:rounded-[45px] p-6 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  {getStatusBadge(item.estado)}
                  <span className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase italic">Ref: {item.id.slice(0,6)}</span>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6">
                  {activeTab === 'empleo' && (
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#7e1d91]/5 rounded-xl md:rounded-2xl flex items-center justify-center text-[#7e1d91] shrink-0 border border-purple-50">
                      <Briefcase size={22} className="md:w-7 md:h-7" />
                    </div>
                  )}
                  <h4 className={`font-black text-[#3b0f52] italic uppercase tracking-tighter leading-tight break-words flex-1 ${activeTab === 'empleo' ? 'text-2xl md:text-4xl' : 'text-xl md:text-3xl'}`}>
                    {activeTab === 'reclamos' ? (item.tipo || 'Consulta') : (vacantes[item.vacanteId] || 'Posición')}
                  </h4>
                </div>

                {activeTab === 'reclamos' && (
                  <p className="text-gray-500 bg-gray-50 p-4 md:p-6 rounded-[20px] md:rounded-[30px] italic text-sm md:text-base leading-relaxed">"{item.comentario}"</p>
                )}
                
                {item.respuestaAdmin && (
                  <div className="bg-purple-50 p-4 md:p-6 rounded-[20px] md:rounded-[30px] border border-purple-100 flex items-start gap-3">
                    <Sparkles className="text-purple-400 mt-1 shrink-0" size={14}/>
                    <p className="text-[#3b0f52] font-bold text-xs md:text-sm">{item.respuestaAdmin}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINACIÓN RESPONSIVE */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10 md:mt-16 pb-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 md:p-4 rounded-full bg-white text-[#7e1d91] disabled:opacity-20 shadow-md"
        >
          <ChevronLeft size={20} md:size={24} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[20px] font-black italic text-xs md:text-sm transition-all ${
                currentPage === index + 1
                ? 'bg-[#7e1d91] text-white shadow-lg scale-110'
                : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 md:p-4 rounded-full bg-white text-[#7e1d91] disabled:opacity-20 shadow-md"
        >
          <ChevronRight size={20} md:size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}