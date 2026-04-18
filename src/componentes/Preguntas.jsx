import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase"; 
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  deleteDoc, doc, updateDoc, serverTimestamp 
} from "firebase/firestore";
import { 
  Send, BookOpen, PlusCircle, Trash2, ChevronDown, 
  ChevronUp, LayoutGrid, ChevronLeft, ChevronRight 
} from "lucide-react";

const AdminCentroAyuda = () => {
  const [categorias, setCategorias] = useState(['General', 'Soporte', 'Clima', 'Perfil', 'Postulación']);
  const [nuevaCat, setNuevaCat] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [preguntaFAQ, setPreguntaFAQ] = useState('');
  const [respuestaFAQ, setRespuestaFAQ] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('General');
  const [mostrarEditor, setMostrarEditor] = useState(true);
  
  // Estados para Consultas
  const [consultas, setConsultas] = useState([]);
  const [respuestasUser, setRespuestasUser] = useState({});

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 5;

  useEffect(() => {
    // Escuchar FAQs
    const unsubFaqs = onSnapshot(query(collection(db, "preguntas"), orderBy("createdAt", "desc")), (snap) => {
      setFaqs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Escuchar Consultas en Vivo (Carga automática)
    const unsubConsultas = onSnapshot(query(collection(db, "consultas"), orderBy("createdAt", "desc")), (snap) => {
      setConsultas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubFaqs(); unsubConsultas(); };
  }, []);

  const totalPages = Math.ceil(faqs.length / faqsPerPage);
  const currentFaqs = faqs.slice((currentPage - 1) * faqsPerPage, currentPage * faqsPerPage);

  const agregarFAQ = async (e) => {
    e.preventDefault();
    if(!preguntaFAQ || !respuestaFAQ) return;
    try {
      await addDoc(collection(db, "preguntas"), {
        categoria: catSeleccionada, pregunta: preguntaFAQ, respuesta: respuestaFAQ, createdAt: serverTimestamp()
      });
      setPreguntaFAQ(''); setRespuestaFAQ('');
    } catch (e) { console.error(e); }
  };

  // Función para responder consultas en vivo
  const responderConsulta = async (id) => {
    if (!respuestasUser[id]?.trim()) return;
    try {
      await updateDoc(doc(db, "consultas", id), {
        respuesta: respuestasUser[id],
        estado: "resuelto"
      });
      setRespuestasUser(prev => ({ ...prev, [id]: "" }));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] p-4 md:p-8 font-sans text-[#3b0f52]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4">
          <div>
            <h1 className="text-3xl font-black text-[#3b0f52]">Centro de Control</h1>
            <p className="text-gray-400 text-sm font-bold italic">Panel Administrativo YapeMascot</p>
          </div>
          <button 
            onClick={() => setMostrarEditor(!mostrarEditor)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-purple-100 rounded-2xl shadow-sm text-[#7e1d91] font-black text-sm hover:bg-purple-50 transition-all"
          >
            <BookOpen size={18} />
            {mostrarEditor ? "Cerrar Editor" : "Abrir Editor"}
          </button>
        </div>

        {/* EDITOR CORREGIDO (Grid 4/8 sin desbordes) */}
        {mostrarEditor && (
          <section className="bg-white rounded-[2.5rem] border border-purple-50 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-4 bg-[#fcfaff] p-8 border-r border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#bd6fe4]">
                    <LayoutGrid size={20} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest">Estructura</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nueva Categoría</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" value={nuevaCat} onChange={e => setNuevaCat(e.target.value)}
                        placeholder="Ej. Pagos..." 
                        className="w-full min-w-0 p-4 rounded-2xl bg-white border-none ring-1 ring-purple-100 focus:ring-2 focus:ring-[#00d1c4] outline-none text-sm font-medium shadow-sm"
                      />
                      <button 
                        onClick={() => { if(nuevaCat) { setCategorias([...categorias, nuevaCat]); setNuevaCat(''); } }}
                        className="bg-[#7e1d91] text-white p-4 rounded-2xl flex-shrink-0"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categorias.map(cat => (
                      <div key={cat} className="px-3 py-1.5 bg-white rounded-xl text-[10px] font-bold border border-purple-100 shadow-sm flex items-center gap-2">
                        {cat}
                        {cat !== 'General' && <button onClick={() => setCategorias(prev => prev.filter(c => c !== cat))} className="text-red-300">×</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 p-8 md:p-12">
                <form onSubmit={agregarFAQ} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Ubicación</label>
                      <select 
                        value={catSeleccionada} onChange={e => setCatSeleccionada(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-[#f8f9fe] border-none ring-1 ring-purple-50 font-bold text-sm outline-none focus:ring-2 focus:ring-[#7e1d91]"
                      >
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Pregunta Principal</label>
                      <input 
                        type="text" required value={preguntaFAQ} onChange={e => setPreguntaFAQ(e.target.value)}
                        placeholder="¿Cómo funciona...?" 
                        className="w-full p-4 rounded-2xl bg-[#f8f9fe] border-none ring-1 ring-purple-50 text-sm font-bold outline-none focus:ring-2 focus:ring-[#7e1d91]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Respuesta del Sistema</label>
                    <textarea 
                      required value={respuestaFAQ} onChange={e => setRespuestaFAQ(e.target.value)}
                      placeholder="Escribe la solución paso a paso..." 
                      className="w-full p-6 rounded-[2rem] bg-[#f8f9fe] border-none ring-1 ring-purple-50 text-sm h-48 focus:ring-2 focus:ring-[#00d1c4] outline-none leading-relaxed resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#00d1c4] text-[#3b0f52] rounded-2xl font-black uppercase tracking-widest hover:brightness-105 transition-all shadow-lg shadow-[#00d1c4]/20">
                    Publicar Contenido Oficial
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* LISTADOS: FAQs Y CONSULTAS EN VIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* FAQs (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3 px-4">
              <span className="w-1.5 h-6 bg-[#bd6fe4] rounded-full"></span>
              Base de Conocimientos
            </h3>
            <div className="grid grid-cols-1 gap-4 px-4">
              {currentFaqs.map(faq => (
                <div key={faq.id} className="p-6 bg-white rounded-[2rem] border border-purple-50 shadow-sm relative group">
                  <button onClick={async () => await deleteDoc(doc(db, "preguntas", faq.id))} className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  <span className="text-[8px] font-black text-[#bd6fe4] uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-md">{faq.categoria}</span>
                  <p className="font-bold text-[#4f2f7a] text-sm mt-2">{faq.pregunta}</p>
                  <p className="text-gray-400 text-[11px] mt-2 leading-relaxed line-clamp-2">{faq.respuesta}</p>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="w-10 h-10 rounded-full bg-white text-[#7e1d91] border border-purple-100 shadow-sm flex items-center justify-center"><ChevronLeft size={18}/></button>
                <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-purple-50 shadow-sm">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i+1} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-full font-black text-[10px] ${currentPage === i+1 ? 'bg-[#7e1d91] text-white' : 'text-gray-400'}`}>{i+1}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="w-10 h-10 rounded-full bg-white text-[#7e1d91] border border-purple-100 shadow-sm flex items-center justify-center"><ChevronRight size={18}/></button>
              </div>
            )}
          </div>

          {/* CONSULTAS EN VIVO (Col 5) - Carga y respuesta funcional */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3 px-4">
              <span className="w-1.5 h-6 bg-[#00d1c4] rounded-full"></span>
              Consultas en Vivo
            </h3>
            <div className="space-y-4 px-4 h-[600px] overflow-y-auto custom-scrollbar">
              {consultas.map(item => (
                <div key={item.id} className={`p-6 rounded-[2.5rem] border transition-all ${item.estado === 'resuelto' ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-purple-100 shadow-xl shadow-purple-500/5'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase">{item.usuarioNombre || "Usuario Anónimo"}</span>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full ${item.estado === 'pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                      {item.estado}
                    </span>
                  </div>
                  <p className="font-bold text-[#3b0f52] text-sm mb-4">"{item.pregunta}"</p>
                  
                  {item.estado === 'pendiente' ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" placeholder="Responder..." 
                        className="flex-1 p-3 bg-gray-50 rounded-xl border-none ring-1 ring-purple-100 text-xs outline-none focus:ring-2 focus:ring-[#00d1c4]"
                        value={respuestasUser[item.id] || ""}
                        onChange={e => setRespuestasUser({...respuestasUser, [item.id]: e.target.value})}
                      />
                      <button onClick={() => responderConsulta(item.id)} className="bg-[#7e1d91] text-white p-3 rounded-xl hover:scale-105 transition-transform shadow-md">
                        <Send size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-500 bg-gray-100/50 p-3 rounded-xl border border-dashed border-gray-200">
                      <span className="font-black uppercase text-[8px] block mb-1">Tu respuesta:</span>
                      {item.respuesta}
                    </div>
                  )}
                </div>
              ))}
              {consultas.length === 0 && <p className="text-center text-gray-300 italic py-10">No hay consultas pendientes.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCentroAyuda;