import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, getDocs, query, orderBy, doc, 
  updateDoc, deleteDoc 
} from 'firebase/firestore';
import { 
  Loader, Mail, User, FileText, DollarSign, Eye, 
  ChevronLeft, ChevronRight, X, Clock, Send, 
  CheckCircle2, Search, Filter, MessageSquare, 
  Trash2, Archive, CheckCircle, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ==========================================================
// 1. COMPONENTE MODAL (ESTILO PRO + GESTIÓN DE ESTADOS)
// ==========================================================
const ReclamoDetailModal = ({ 
  reclamo, onClose, respuesta, setRespuesta, 
  estado, setEstado, onEnviar, enviando 
}) => {
  if (!reclamo) return null;

  const estados = [
    { id: 'pendiente', label: 'Pendiente', icon: <Clock size={16}/>, color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { id: 'respondido', label: 'Resuelto', icon: <CheckCircle2 size={16}/>, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { id: 'archivado', label: 'Archivado', icon: <Archive size={16}/>, color: 'bg-slate-100 text-slate-600 border-slate-200' }
  ];

  return (
    <div className="fixed inset-0 bg-[#3b0f52]/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-4xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        
        {/* Header con degradado PRO */}
        <div className="bg-linear-to-r from-[#7e1d91] via-[#8f3cbf] to-[#bd6fe4] p-8 text-white flex justify-between items-center relative">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Panel de Administración</span>
            <h2 className="text-3xl font-black italic mt-1">Gestionar Registro</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-2xl transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="overflow-y-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Columna Izquierda: Detalles del Cliente */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-[#7e1d91] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <User size={14} /> Información del Reclamo
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#fcfaff] p-5 rounded-3xl border border-[#ecd8ff]">
                   <p className="text-[10px] font-black text-[#7e1d91]/40 uppercase tracking-widest">Cliente</p>
                   <p className="text-base text-[#3b0f52] font-black">{reclamo.nombres} {reclamo.apellidos}</p>
                </div>
                <div className="bg-[#fcfaff] p-5 rounded-3xl border border-[#ecd8ff]">
                   <p className="text-[10px] font-black text-[#7e1d91]/40 uppercase tracking-widest">Contacto</p>
                   <p className="text-base text-[#3b0f52] font-black">{reclamo.correo}</p>
                </div>
                <div className="bg-[#fcfaff] p-5 rounded-3xl border border-[#ecd8ff] flex justify-between items-center">
                   <div>
                    <p className="text-[10px] font-black text-[#7e1d91]/40 uppercase tracking-widest">Monto en Disputa</p>
                    <p className="text-xl text-[#7e1d91] font-black">S/ {reclamo.montoReclamado}</p>
                   </div>
                   <span className="px-4 py-2 bg-white border border-[#ecd8ff] text-[10px] font-black rounded-xl uppercase italic text-[#7e1d91] shadow-sm">
                      {reclamo.tipo}
                   </span>
                </div>
                <div className="bg-[#fcfaff] p-6 rounded-4xl border border-[#ecd8ff] shadow-inner">
                   <p className="text-[10px] font-black text-[#7e1d91]/40 uppercase tracking-widest mb-2">Mensaje Original</p>
                   <p className="text-sm text-[#3b0f52] font-semibold leading-relaxed italic">"{reclamo.comentario}"</p>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Resolución */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black text-[#25d3c9] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <CheckCircle size={14} /> Actualizar Estado
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {estados.map((est) => (
                    <button
                      key={est.id}
                      onClick={() => setEstado(est.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                        estado === est.id 
                        ? 'border-[#7e1d91] bg-[#fcfaff] shadow-md scale-105' 
                        : 'border-transparent bg-gray-50 text-gray-400 opacity-60'
                      }`}
                    >
                      {est.icon}
                      <span className="text-[10px] font-black uppercase">{est.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={onEnviar} className="space-y-5">
                <div>
                  <h3 className="text-xs font-black text-[#7e1d91] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Respuesta Oficial
                  </h3>
                  <textarea 
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    className="w-full h-48 bg-[#fcfaff] border-2 border-[#ecd8ff] rounded-4xl p-6 text-sm focus:outline-none focus:border-[#7e1d91] transition-all resize-none font-medium text-[#3b0f52]"
                    placeholder="Escribe la respuesta que verá el cliente..."
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-[#7e1d91] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#3b0f52] hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {enviando ? <Loader className="animate-spin" size={24} /> : <><Send size={20} /> Guardar y Notificar</>}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// 2. COMPONENTE PRINCIPAL
// ==========================================================
export default function GestionReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [enviando, setEnviando] = useState(false);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'reclamos'), orderBy('fechaCreacion', 'desc'));
      const snap = await getDocs(q);
      setReclamos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!respuesta.trim()) return toast.error("La respuesta es obligatoria");

    setEnviando(true);
    try {
      const docRef = doc(db, 'reclamos', selectedReclamo.id);
      await updateDoc(docRef, {
        respuestaAdmin: respuesta,
        estado: estado,
        fechaRespuesta: new Date()
      });
      toast.success("Información actualizada");
      setSelectedReclamo(null);
      fetchData();
    } catch (err) {
      toast.error("Error al guardar");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este registro permanentemente?")) return;
    try {
      await deleteDoc(doc(db, 'reclamos', id));
      toast.success("Registro borrado");
      fetchData();
    } catch (err) {
      toast.error("No se pudo eliminar");
    }
  };

  const filtrados = reclamos.filter(r => {
    const searchStr = (r.nombres + r.apellidos + r.correo).toLowerCase();
    const matchesSearch = searchStr.includes(busqueda.toLowerCase());
    const matchesStatus = filtroEstado === 'todos' || r.estado === filtroEstado;
    return matchesSearch && matchesStatus;
  });

  const totalPaginas = Math.ceil(filtrados.length / itemsPerPage);
  const itemsActuales = filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <Loader className="animate-spin text-[#7e1d91]" size={48} />
      <p className="text-[#7e1d91] font-black uppercase tracking-[0.4em] text-[10px]">Actualizando Base de Datos...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 p-4">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h1 className="text-4xl font-black text-[#3b0f52] italic tracking-tight">Libro de Reclamaciones</h1>
           <p className="text-[#7e1d91] font-bold text-sm uppercase tracking-widest mt-2">Gestión de atención al cliente e incidencias</p>
        </div>
      </div>

      {/* Controles PRO */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7e1d91]/30" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, apellido o email..."
            className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border border-[#ecd8ff] text-[#3b0f52] font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#7e1d91]/5 transition-all"
            value={busqueda}
            onChange={(e) => {setBusqueda(e.target.value); setCurrentPage(1);}}
          />
        </div>
        <div className="md:w-72 relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7e1d91]/30" size={18} />
          <select 
            className="w-full pl-12 pr-6 py-5 rounded-3xl bg-white border border-[#ecd8ff] text-[#7e1d91] font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer shadow-sm focus:outline-none"
            value={filtroEstado}
            onChange={(e) => {setFiltroEstado(e.target.value); setCurrentPage(1);}}
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">🟠 Pendientes</option>
            <option value="respondido">🟢 Respondidos</option>
            <option value="archivado">⚪ Archivados</option>
          </select>
        </div>
      </div>

      {/* Tabla con Estilo "Boutique" */}
      <div className="bg-white rounded-[2.5rem] border border-[#ecd8ff] shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaff] border-b border-[#ecd8ff]">
                <th className="p-8 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em]">Remitente</th>
                <th className="p-8 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em] text-center">Estado</th>
                <th className="p-8 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f1ff]">
              {itemsActuales.map((r) => (
                <tr key={r.id} className="hover:bg-[#fcfaff]/50 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#7e1d91]/5 rounded-2xl flex items-center justify-center text-[#7e1d91] font-black">
                        {r.nombres[0]}{r.apellidos[0]}
                      </div>
                      <div>
                        <p className="text-base font-black text-[#3b0f52]">{r.nombres} {r.apellidos}</p>
                        <p className="text-[11px] text-[#6b4a88] font-medium italic">{r.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-wider border ${
                        r.estado === 'respondido' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                        r.estado === 'archivado' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                        'bg-amber-50 text-amber-500 border-amber-100'
                      }`}>
                        {r.estado === 'respondido' ? <CheckCircle2 size={12}/> : r.estado === 'archivado' ? <Archive size={12}/> : <Clock size={12}/>}
                        {r.estado || 'pendiente'}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => { 
                          setSelectedReclamo(r); 
                          setRespuesta(r.respuestaAdmin || ''); 
                          setEstado(r.estado || 'pendiente'); 
                        }}
                        className="bg-white border-2 border-[#7e1d91] text-[#7e1d91] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7e1d91] hover:text-white transition-all shadow-sm flex items-center gap-2"
                      >
                        <Eye size={16} /> Gestionar
                      </button>
                      <button 
                        onClick={() => handleEliminar(r.id)}
                        className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación PRO */}
        {totalPaginas > 1 && (
          <div className="p-8 bg-[#fcfaff] border-t border-[#ecd8ff] flex items-center justify-between">
            <p className="text-[11px] font-black text-[#7e1d91]/40 uppercase tracking-widest">
              Mostrando <span className="text-[#7e1d91]">{itemsActuales.length}</span> registros de {filtrados.length}
            </p>
            <div className="flex gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-4 bg-white border border-[#ecd8ff] rounded-2xl text-[#7e1d91] disabled:opacity-20 hover:shadow-md transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={currentPage === totalPaginas}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-4 bg-white border border-[#ecd8ff] rounded-2xl text-[#7e1d91] disabled:opacity-20 hover:shadow-md transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render del Modal de Gestión */}
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