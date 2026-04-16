import { useState, useEffect, useCallback } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, query } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { FaSave, FaTimes } from "react-icons/fa";
import { 
  ChevronLeft, ChevronRight, Loader, AlertTriangle, 
  Edit, Trash2, RefreshCw, Search, User
} from "lucide-react";

const functions = getFunctions();
const deleteUserCallable = httpsCallable(functions, "deleteUser");
const ROLES = ["cliente", "editor", "admin"];
const ROLE_ORDER = { admin: 1, editor: 2, cliente: 3 };

export default function GestionUsuarios() {
  const { usuarioActual } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  const [filtro, setFiltro] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'rol', direction: 'asc' });

  const fetchUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const q = query(collection(db, "usuarios"));
      const querySnapshot = await getDocs(q);
      const listaUsuarios = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
        fechaCreacion: docu.data().fechaCreacion?.toDate(),
      }));
      setAllUsers(listaUsuarios);
      setError(null);
    } catch (err) {
      setError("Error al cargar usuarios.");
      toast.error("Error de conexión");
    } finally {
      setTimeout(() => setCargando(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  useEffect(() => {
    let filtered = allUsers.filter(u => 
      (u.username && u.username.toLowerCase().includes(filtro.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (sortConfig.key === 'rol') {
        valA = ROLE_ORDER[a.rol] || 99;
        valB = ROLE_ORDER[b.rol] || 99;
      }
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setDisplayedUsers(filtered);
    setCurrentPage(1);
  }, [allUsers, filtro, sortConfig]);

  const handleGuardarRol = async (id, rolActual) => {
    if (rolActual === "admin" && allUsers.filter((u) => u.rol === "admin").length <= 1 && nuevoRol !== "admin") {
      toast.error("Se requiere al menos un administrador.");
      return;
    }
    const toastId = toast.loading("Guardando...");
    try {
      await updateDoc(doc(db, "usuarios", id), { rol: nuevoRol });
      await fetchUsuarios();
      setEditandoId(null);
      toast.success("Rol actualizado", { id: toastId });
    } catch (err) {
      toast.error("Error al actualizar", { id: toastId });
    }
  };

  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);
  const paginatedUsers = displayedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Componente de Avatar para centralizar la lógica de imagen/iniciales
  const Avatar = ({ usuario, className = "w-10 h-10" }) => (
    usuario.fotoURL ? (
      <img src={usuario.fotoURL} alt={usuario.username} className={`${className} rounded-[18px] object-cover border-2 border-white shadow-sm`} />
    ) : (
      <div className={`${className} bg-[#3b0f52] text-white rounded-[18px] flex items-center justify-center font-black text-sm italic shadow-md`}>
        {usuario.username?.[0]?.toUpperCase() || <User size={16}/>}
      </div>
    )
  );

  const renderRoleBadge = (rol) => (
    <span className={`px-4 py-1.5 text-[10px] font-black uppercase italic rounded-full border-2 ${
      rol === "admin" ? "bg-red-50 text-red-600 border-red-100"
      : rol === "editor" ? "bg-purple-50 text-purple-600 border-purple-100"
      : "bg-gray-50 text-gray-500 border-gray-100"
    }`}>
      {rol}
    </span>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* BUSCADOR */}
      <div className="bg-white p-4 md:p-5 rounded-[2.5rem] border border-[#ecd8ff]/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]/30" size={20} />
          <input 
            type="text" 
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Buscar por nombre..." 
            className="w-full pl-16 pr-8 py-4 rounded-full bg-[#fcfaff] border-2 border-transparent focus:border-[#ecd8ff] font-bold text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            onChange={(e) => {
              const [key, direction] = e.target.value.split('_');
              setSortConfig({ key, direction });
            }}
            className="flex-1 md:flex-none pl-6 pr-10 py-4 rounded-full bg-[#fcfaff] border-2 border-transparent font-black text-[11px] uppercase tracking-widest text-[#3b0f52] outline-none cursor-pointer"
          >
            <option value="rol_asc">Ordenar por Rol</option>
            <option value="fechaCreacion_desc">Más recientes</option>
            <option value="username_asc">Nombre (A-Z)</option>
          </select>
          <button onClick={fetchUsuarios} className="p-4 bg-[#7e1d91] text-white rounded-2xl shadow-lg shadow-[#7e1d91]/20">
            <RefreshCw size={20} className={cargando ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE TABLA / TARJETAS */}
      <div className="relative bg-white rounded-[2.5rem] md:rounded-[3rem] border border-[#ecd8ff] shadow-xl overflow-hidden min-h-[400px]">
        {cargando ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
            <Loader className="animate-spin text-[#7e1d91]" size={40} />
            <p className="mt-4 font-black text-[#3b0f52] italic uppercase text-[10px] tracking-[0.3em]">Cargando Base...</p>
          </div>
        ) : (
          <>
            {/* DESKTOP: TABLA CLÁSICA */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fcfaff] border-b border-[#f0e4ff]">
                    <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-left">Usuario</th>
                    <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-left">Rol Asignado</th>
                    <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-left">Creación</th>
                    <th className="px-10 py-7 text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f7f1ff]">
                  {paginatedUsers.map((usuario) => (
                    <tr key={usuario.id} className="group hover:bg-[#fcfaff]/50 transition-all">
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar usuario={usuario} />
                          <span className="font-black text-[#3b0f52] text-sm uppercase italic">@{usuario.username}</span>
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        {editandoId === usuario.id ? (
                          <select 
                            value={nuevoRol} 
                            onChange={(e) => setNuevoRol(e.target.value)} 
                            className="bg-white border-2 border-[#ecd8ff] text-[#3b0f52] font-black px-4 py-2 rounded-xl text-xs outline-none"
                          >
                            {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                          </select>
                        ) : ( renderRoleBadge(usuario.rol) )}
                      </td>
                      <td className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                        {usuario.fechaCreacion ? format(usuario.fechaCreacion, "dd MMM, yyyy") : "---"}
                      </td>
                      <td className="px-10 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editandoId === usuario.id ? (
                            <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><FaSave size={18}/></button>
                          ) : (
                            usuarioActual?.uid !== usuario.id && (
                              <button onClick={() => {setEditandoId(usuario.id); setNuevoRol(usuario.rol);}} className="p-3 text-[#7e1d91] hover:bg-[#f7f1ff] rounded-xl transition-all"><Edit size={18} /></button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE: TARJETAS VERTICALES (Arreglo de Responsive) */}
            <div className="md:hidden p-4 space-y-4">
              {paginatedUsers.map((usuario) => (
                <div key={usuario.id} className="bg-[#fcfaff] rounded-4xl border border-[#ecd8ff]/40 p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar usuario={usuario} className="w-14 h-14" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#3b0f52] uppercase italic text-sm truncate">@{usuario.username}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {usuario.fechaCreacion ? format(usuario.fechaCreacion, "dd/MM/yyyy") : ""}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[#ecd8ff]/30">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-[#7e1d91]/40 uppercase tracking-widest mb-1">Permisos</span>
                      {renderRoleBadge(usuario.rol)}
                    </div>
                    {usuarioActual?.uid !== usuario.id && (
                      <button 
                        onClick={() => {setEditandoId(usuario.id); setNuevoRol(usuario.rol);}}
                        className="p-3 bg-white border border-[#ecd8ff] text-[#7e1d91] rounded-2xl shadow-sm active:scale-90 transition-transform"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>

                  {/* MINI FORMULARIO SI ESTÁ EDITANDO EN MÓVIL */}
                  {editandoId === usuario.id && (
                    <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-[#7e1d91]/20 space-y-3">
                      <select 
                        value={nuevoRol} 
                        onChange={(e) => setNuevoRol(e.target.value)} 
                        className="w-full bg-[#fcfaff] border-2 border-[#ecd8ff] text-[#3b0f52] font-black px-4 py-3 rounded-xl text-xs outline-none"
                      >
                        {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase italic">Guardar</button>
                        <button onClick={() => setEditandoId(null)} className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-xl font-black text-[10px] uppercase italic">Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* PAGINACIÓN */}
      {!cargando && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 rounded-full bg-white text-[#7e1d91] border border-[#f0e4ff] disabled:opacity-20 shadow-md flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-[#f0e4ff] shadow-sm">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-black italic text-xs transition-all ${
                  currentPage === i + 1
                  ? 'bg-[#7e1d91] text-white shadow-lg'
                  : 'text-gray-400 hover:text-[#7e1d91]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 rounded-full bg-white text-[#7e1d91] border border-[#f0e4ff] disabled:opacity-20 shadow-md flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}