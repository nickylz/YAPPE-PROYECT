import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { 
  Mail, MessageSquare, Clock, CheckCircle2, 
  ChevronRight, Inbox, Search, Filter 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BandejaReclamos() {
  const { usuarioActual } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos"); 
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Se usa usuarioActual.email para buscar en el campo 'correo' de la base de datos
    if (!usuarioActual?.email) return;

    // Cambiado: "email" por "correo" en la consulta de Firestore
    const q = query(
      collection(db, "reclamos"),
      where("correo", "==", usuarioActual.email),
      orderBy("fechaCreacion", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReclamos(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [usuarioActual]);

  const reclamosFiltrados = reclamos.filter(r => {
    const cumpleFiltro = filtro === "todos" || r.estado === filtro;
    const cumpleBusqueda = r.comentario?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  return (
    <div className="min-h-screen bg-[#fcfaff]">
      {/* Banner de Bienvenida con estilo unificado */}
      <div className="w-full bg-linear-to-r from-[#7e1d91] via-[#8f3cbf] to-[#bd6fe4] shadow-[0_40px_120px_rgba(126,29,145,0.18)] py-16 md:py-20 text-center text-white mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-[#f3e6ff]/90 mb-4">Gestión de Reclamos</p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight px-4 flex items-center justify-center gap-4 italic">
          <Inbox size={48} className="text-[#25d3c9]" />
          Mis Mensajes y Reclamos
        </h1>
        <p className="mt-4 text-[#f7ebff]/90 max-w-3xl mx-auto text-base md:text-xl px-4">
          Desde aquí puedes revisar el estado de tus solicitudes y las respuestas de soporte.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 pb-20 relative z-20">
        <div className="bg-white rounded-4xl shadow-2xl border border-[#ecd8ff] overflow-hidden">
          
          {/* BARRA DE HERRAMIENTAS */}
          <div className="p-6 border-b border-[#f7f1ff] flex flex-col md:flex-row gap-4 items-center justify-between bg-[#fcfaff]/50">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7e1d91]/40" size={18} />
              <input 
                type="text" 
                placeholder="Buscar en mis reclamos..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#ecd8ff] focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/10 font-medium text-[#3b0f52]"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#7e1d91]" />
              <select 
                className="bg-white border border-[#ecd8ff] py-2 px-4 rounded-xl font-bold text-[#7e1d91] text-sm focus:outline-none"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="respondido">Respondidos</option>
              </select>
            </div>
          </div>

          {/* LISTA DE MENSAJES */}
          <div className="divide-y divide-[#f7f1ff]">
            {loading ? (
              <div className="p-20 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-[#7e1d91] border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-[#6b4a88] font-bold">Cargando tus mensajes...</p>
              </div>
            ) : reclamosFiltrados.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-[#f7f1ff] rounded-full flex items-center justify-center mx-auto text-[#7e1d91]/20">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-xl font-black text-[#3b0f52]">No hay mensajes</h3>
                <p className="text-[#6b4a88] max-w-xs mx-auto text-sm font-medium">
                  Aquí aparecerán las respuestas a los reclamos realizados con el correo: <br/>
                  <span className="text-[#7e1d91]">{usuarioActual.email}</span>
                </p>
              </div>
            ) : (
              reclamosFiltrados.map((reclamo) => (
                <div 
                  key={reclamo.id} 
                  className="group p-6 hover:bg-[#fcfaff] transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  {/* Icono de Estado */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
                    reclamo.estado === 'respondido' ? 'bg-[#25d3c9]/10 text-[#25d3c9]' : 'bg-[#7e1d91]/10 text-[#7e1d91]'
                  }`}>
                    {reclamo.estado === 'respondido' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>

                  {/* Contenido del Mensaje */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                        reclamo.estado === 'respondido' ? 'bg-[#25d3c9] text-white' : 'bg-[#7e1d91] text-white'
                      }`}>
                        {reclamo.estado || 'pendiente'}
                      </span>
                      <span className="text-xs text-[#6b4a88] font-bold">
                        {reclamo.fechaCreacion ? format(reclamo.fechaCreacion.toDate(), "d 'de' MMMM, p", { locale: es }) : 'Reciente'}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-[#3b0f52] group-hover:text-[#7e1d91] transition-colors line-clamp-1">
                      Reclamo #{reclamo.id.slice(0, 6).toUpperCase()} - {reclamo.tipo || 'General'}
                    </h4>
                    <p className="text-[#6b4a88] text-sm font-medium line-clamp-2 leading-relaxed italic">
                      "{reclamo.comentario}"
                    </p>
                    
                    {/* Respuesta del Admin (si existe) */}
                    {reclamo.respuestaAdmin && (
                      <div className="mt-4 bg-white border-l-4 border-[#25d3c9] p-4 rounded-r-2xl shadow-sm animate-in slide-in-from-left">
                        <p className="text-[10px] font-black text-[#25d3c9] uppercase mb-1">Respuesta de Soporte:</p>
                        <p className="text-[#3b0f52] text-sm font-semibold">{reclamo.respuestaAdmin}</p>
                      </div>
                    )}
                  </div>

                  <div className="hidden md:block">
                    <ChevronRight className="text-[#ecd8ff] group-hover:text-[#7e1d91] transition-colors" size={24} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-[#fcfaff] border-t border-[#f7f1ff] text-center">
            <p className="text-[10px] font-black text-[#7e1d91]/40 uppercase tracking-[0.3em]">
              Sistema de Respuesta • Intranet 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}