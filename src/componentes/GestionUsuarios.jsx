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
  User, Edit, Trash2, RefreshCw, Search, Filter 
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
  const [usersPerPage] = useState(10);
  const [filtro, setFiltro] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'rol', direction: 'asc' });

  const fetchUsuarios = useCallback(async () => {
    if (!cargando) setCargando(true);
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
      const errorMessage = "Error al cargar los usuarios. " + err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCargando(false);
    }
  }, [cargando]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    let filtered = allUsers.filter(u => 
      (u.username && u.username.toLowerCase().includes(filtro.toLowerCase())) ||
      (u.correo && u.correo.toLowerCase().includes(filtro.toLowerCase()))
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
      toast.error("¡Error! No puedes quitar el rol al único administrador.");
      return;
    }
    if (nuevoRol === "") {
      toast.error("Por favor, selecciona un nuevo rol.");
      return;
    }
    
    const toastId = toast.loading("Actualizando rol...");
    try {
      const userRef = doc(db, "usuarios", id);
      await updateDoc(userRef, { rol: nuevoRol });
      await fetchUsuarios();
      setEditandoId(null);
      toast.success("Rol actualizado con éxito.", { id: toastId });
    } catch (err) {
      toast.error("Error al actualizar el rol. " + err.message, { id: toastId });
    }
  };

  const handleDeleteUser = async (usuario) => {
    if (!window.confirm(`¡ATENCIÓN! Estás a punto de eliminar al usuario ${usuario.correo}. ¿Continuar?`)) return;
      
    const toastId = toast.loading("Eliminando usuario...");
    try {
      const result = await deleteUserCallable({ docId: usuario.id });
      if (result.data?.success) {
        toast.success(`Usuario eliminado con éxito.`, { id: toastId });
        await fetchUsuarios();
      } else {
        throw new Error(result.data?.message || "Error desconocido.");
      }
    } catch (error) {
      toast.error(`Error al eliminar: ${error.message}`, { id: toastId });
    }
  };
  
  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('_');
    setSortConfig({ key, direction });
  }

  const puedeEditar = (usuario) => {
    if (!usuarioActual || usuario.id === usuarioActual.uid) return false;
    if (usuarioActual.rol === 'admin') return true;
    if (usuarioActual.rol === 'editor' && !['admin', 'editor'].includes(usuario.rol)) return true;
    return false;
  }
  
  const puedeEliminar = (usuario) => {
    if (!usuarioActual || usuario.id === usuarioActual.uid) return false;
    return usuarioActual.rol === 'admin';
  }

  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);
  const paginatedUsers = displayedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const renderRoleBadge = (rol) => (
    <span className={`px-3 py-1 text-[10px] font-black uppercase italic rounded-lg ${
      rol === "admin" ? "bg-red-100 text-red-600"
      : rol === "editor" ? "bg-purple-100 text-purple-600"
      : "bg-gray-100 text-gray-600"
    }`}>
      {rol}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Encabezado y Buscador Estilo Postulaciones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Buscar por nombre o correo..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#fcfaff] border border-[#ecd8ff] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/10"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              onChange={handleSortChange} 
              defaultValue="rol_asc" 
              className="w-full md:w-auto pl-4 pr-10 py-3 rounded-2xl bg-[#fcfaff] border border-[#ecd8ff] font-bold text-[11px] uppercase tracking-wider text-[#3b0f52] appearance-none focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/10"
            >
              <option value="rol_asc">Ordenar por Rol</option>
              <option value="fechaCreacion_desc">Más recientes</option>
              <option value="fechaCreacion_asc">Más antiguos</option>
              <option value="username_asc">Username (A-Z)</option>
            </select>
          </div>
          <button 
            onClick={fetchUsuarios} 
            className="p-3 bg-white border border-[#ecd8ff] text-[#7e1d91] rounded-2xl hover:bg-[#fcfaff] transition-colors disabled:opacity-50"
            disabled={cargando}
          >
            <RefreshCw size={20} className={cargando ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {cargando ? (
        <div className="py-20 text-center">
          <Loader className="animate-spin mx-auto text-[#7e1d91]" size={40} />
          <p className="mt-4 font-bold text-[#3b0f52] italic uppercase text-sm">Cargando Usuarios...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-red-700 bg-red-50 p-6 rounded-[2rem] border border-red-100">
          <AlertTriangle size={24} />
          <p className="font-bold text-sm uppercase">{error}</p>
        </div>
      ) : (
        <>
          {/* Diseño Mobile - Estilo Tarjetas de Postulaciones */}
          <div className="md:hidden space-y-4">
            {paginatedUsers.map((usuario) => (
               <div key={usuario.id} className="bg-white rounded-[2.5rem] border border-[#ecd8ff] p-6 space-y-4">
               <div className="flex items-center gap-4">
                   {usuario.fotoURL ? (
                       <img src={usuario.fotoURL} alt={usuario.username} className="w-14 h-14 rounded-[20px] object-cover border-2 border-[#f7f1ff] shadow-md"/>
                   ) : (
                       <div className="w-14 h-14 bg-[#7e1d91] text-white rounded-[20px] flex items-center justify-center font-black text-xl italic shadow-lg shadow-[#7e1d91]/20">
                           {usuario.username?.[0]?.toUpperCase() || <User size={24}/>}
                       </div>
                   )}
                   <div className="min-w-0">
                       <p className="font-black text-[#3b0f52] text-base uppercase italic truncate">@{usuario.username}</p>
                       <p className="text-[11px] text-[#7e1d91]/60 font-bold truncate lowercase">{usuario.correo}</p>
                   </div>
               </div>
               
               <div className="pt-2">
                   {editandoId === usuario.id ? (
                       <div className="bg-[#fcfaff] p-4 rounded-2xl border border-[#ecd8ff] space-y-3">
                           <select 
                            value={nuevoRol} 
                            onChange={(e) => setNuevoRol(e.target.value)} 
                            className="w-full bg-white border border-[#ecd8ff] text-[#3b0f52] font-bold px-4 py-2 rounded-xl text-xs focus:ring-2 focus:ring-[#7e1d91]/20 outline-none"
                           >
                               {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                           </select>
                           <div className="flex gap-2">
                               <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="flex-1 bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 flex items-center justify-center gap-2 text-[10px] font-black uppercase"><FaSave size={14} /> Guardar</button>
                               <button onClick={() => setEditandoId(null)} className="flex-1 bg-gray-400 text-white p-3 rounded-xl hover:bg-gray-500 flex items-center justify-center gap-2 text-[10px] font-black uppercase"><FaTimes size={14} /> Cancelar</button>
                           </div>
                       </div>
                   ) : (
                       <div className="flex flex-col gap-4">
                           <div className="flex justify-between items-center bg-[#fcfaff] px-4 py-2 rounded-xl border border-[#f7f1ff]">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rol actual</span>
                              {renderRoleBadge(usuario.rol)}
                           </div>
                           {(puedeEditar(usuario) || puedeEliminar(usuario)) && (
                               <div className="flex gap-2">
                                   {puedeEditar(usuario) && (
                                     <button 
                                      onClick={() => {setEditandoId(usuario.id); setNuevoRol(usuario.rol);}} 
                                      className="flex-1 px-4 py-3 bg-white border border-[#ecd8ff] text-[#7e1d91] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7e1d91] hover:text-white transition-all"
                                     >
                                      Editar Rol
                                     </button>
                                   )}
                                   {puedeEliminar(usuario) && (
                                     <button 
                                      onClick={() => handleDeleteUser(usuario)} 
                                      className="px-4 py-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                                     >
                                      <Trash2 size={16} />
                                     </button>
                                   )}
                               </div>
                           )}
                       </div>
                   )}
               </div>
           </div>
            ))}
          </div>

          {/* Diseño Desktop - Tabla Estilo Postulaciones */}
          <div className="hidden md:block bg-white rounded-[2.5rem] border border-[#ecd8ff] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fcfaff] border-b border-[#ecd8ff]">
                  <th className="px-8 py-5 text-[10px] font-black text-[#7e1d91] uppercase tracking-widest">Usuario</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#7e1d91] uppercase tracking-widest">Correo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#7e1d91] uppercase tracking-widest">Rol</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#7e1d91] uppercase tracking-widest">Creación</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[#7e1d91] uppercase tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f1ff]">
                {paginatedUsers.map((usuario) => (
                  <tr key={usuario.id} className="group hover:bg-[#fcfaff]/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#3b0f52] text-white rounded-lg flex items-center justify-center font-black text-xs italic">
                          {usuario.username?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-black text-[#3b0f52] text-sm uppercase italic">@{usuario.username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-[#7e1d91]/60 lowercase">{usuario.correo}</td>
                    <td className="px-8 py-6">
                      {editandoId === usuario.id ? (
                        <select 
                          value={nuevoRol} 
                          onChange={(e) => setNuevoRol(e.target.value)} 
                          className="bg-white border border-[#ecd8ff] text-[#3b0f52] font-bold px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-[#7e1d91]/20 outline-none"
                        >
                          {ROLES.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                        </select>
                      ) : ( renderRoleBadge(usuario.rol) )}
                    </td>
                    <td className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                      {usuario.fechaCreacion ? format(usuario.fechaCreacion, "dd MMM yyyy") : "N/A"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {editandoId === usuario.id ? (
                          <>
                            <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Guardar"><FaSave size={18}/></button>
                            <button onClick={() => setEditandoId(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors" title="Cancelar"><FaTimes size={18}/></button>
                          </>
                        ) : (
                          <>
                            {puedeEditar(usuario) && (
                              <button 
                                onClick={() => {setEditandoId(usuario.id); setNuevoRol(usuario.rol);}} 
                                className="p-2 text-[#7e1d91] hover:bg-[#f7f1ff] rounded-xl transition-all" 
                                title="Editar Rol"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            {puedeEliminar(usuario) && (
                              <button 
                                onClick={() => handleDeleteUser(usuario)} 
                                className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all" 
                                title="Eliminar Usuario"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación Estilo Postulaciones */}
          {totalPages > 1 && (
             <div className="flex justify-center items-center pt-8 gap-4">
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="p-3 rounded-2xl bg-white border border-[#ecd8ff] text-[#7e1d91] shadow-sm hover:bg-[#fcfaff] disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex bg-white rounded-2xl border border-[#ecd8ff] p-1 shadow-sm">
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
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="p-3 rounded-2xl bg-white border border-[#ecd8ff] text-[#7e1d91] shadow-sm hover:bg-[#fcfaff] disabled:opacity-30 transition-all"
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