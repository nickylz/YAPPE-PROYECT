import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { Search, ChevronDown, MessageCircle, X, LogIn, Send } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function CentrodeAyuda() {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  // Estados para Preguntas Frecuentes
  const [preguntas, setPreguntas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catActiva, setCatActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [abiertoId, setAbiertoId] = useState(null);

  // Estados para los Modales de Contacto
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [nuevaPregunta, setNuevaPregunta] = useState({ texto: '', categoria: 'General' });

  // Cargar FAQs desde Firestore
  useEffect(() => {
    const q = query(collection(db, "preguntas"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPreguntas(docs);
      const cats = ['Todas', ...new Set(docs.map(p => p.categoria))];
      setCategorias(cats);
    });
    return () => unsubscribe();
  }, []);

  const manejarClickContacto = () => {
    if (!usuarioActual) {
      setShowAuthModal(true);
    } else {
      setShowModal(true);
    }
  };

  const enviarPregunta = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "consultas"), {
        usuarioId: usuarioActual.uid,
        usuarioNombre: usuarioActual.nombre || usuarioActual.username || "Usuario",
        pregunta: nuevaPregunta.texto,
        categoria: nuevaPregunta.categoria,
        estado: "pendiente",
        respuesta: "",
        createdAt: serverTimestamp()
      });
     
      setShowModal(false);
      setNuevaPregunta({ texto: '', categoria: 'General' });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al enviar consulta:", error);
    }
  };

  const filtrados = preguntas.filter(p => {
    const matchBusqueda = p.pregunta?.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = catActiva === 'Todas' || p.categoria === catActiva;
    return matchBusqueda && matchCat;
  });

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans">
      {/* BANNER PRINCIPAL */}
      <section className="bg-gradient-to-r from-[#3b0f52] to-[#7e1d91] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d1c4] opacity-10 rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter">
            Centro de <span className="text-[#00d1c4]">Ayuda</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">¿Tienes dudas? Estamos aquí para que todo fluya.</p>
          
          <div className="max-w-2xl mx-auto relative px-4">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#7e1d91]" size={20} />
            <input 
              type="text"
              placeholder="Escribe tu duda aquí..."
              className="w-full py-4 pl-14 pr-6 rounded-2xl bg-white shadow-xl focus:ring-4 focus:ring-[#00d1c4]/30 outline-none text-[#3b0f52]"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* FILTRO DE CATEGORÍAS */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCatActiva(cat)}
              className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                catActiva === cat 
                ? 'bg-[#00d1c4] text-[#3b0f52] shadow-lg shadow-cyan-200' 
                : 'bg-white text-[#7e1d91] border border-purple-100 hover:bg-purple-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTA DE ACORDEONES (FAQS) */}
        <div className="space-y-4">
          {filtrados.length > 0 ? (
            filtrados.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[24px] border border-purple-50 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button 
                  onClick={() => setAbiertoId(abiertoId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="font-black text-[#3b0f52] text-lg pr-4">{item.pregunta}</span>
                  <ChevronDown 
                    className={`text-[#7e1d91] transition-transform duration-300 ${abiertoId === item.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {abiertoId === item.id && (
                  <div className="px-6 pb-6 text-[#6b4a88] font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                    <div className="h-[2px] bg-[#fcfaff] mb-4"></div>
                    {item.respuesta}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 opacity-50">
              <Search size={48} className="mx-auto mb-4 text-[#7e1d91]" />
              <p className="font-black uppercase tracking-widest text-sm">No hay coincidencias</p>
            </div>
          )}
        </div>

        {/* SECCIÓN FINAL DE CONTACTO DIRECTO */}
        <div className="mt-16 bg-[#3b0f52] rounded-[32px] p-8 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <MessageCircle size={40} className="mx-auto mb-4 text-[#00d1c4]" />
                <h3 className="text-2xl font-black mb-2">¿No encuentras lo que buscas?</h3>
                <p className="mb-6 text-white/70">Escríbenos y un experto te responderá directamente en tu perfil.</p>
                <button 
                  onClick={manejarClickContacto}
                  className="bg-[#00d1c4] text-[#3b0f52] px-8 py-4 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
                >
                    Hacer una pregunta directa
                </button>
            </div>
            {/* Decoración de fondo */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#7e1d91] rounded-full -mb-10 -mr-10 opacity-50"></div>
        </div>
      </main>

      {/* --- MODALES --- */}

      {/* MODAL 1: AUTH REQUERIDA */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-sm p-10 text-center relative animate-in zoom-in-95">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn size={40} className="text-[#7e1d91]" />
            </div>
            <h2 className="text-2xl font-black text-[#3b0f52] mb-4 tracking-tighter">¡Identifícate!</h2>
            <p className="text-gray-500 mb-8 font-medium">Debes iniciar sesión para enviar preguntas y recibir respuestas personalizadas.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#7e1d91] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3b0f52] transition-colors shadow-lg shadow-purple-200"
            >
              Inicia Sesión / Regístrate
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: FORMULARIO DE CONSULTA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-300 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-[#3b0f52] mb-6">Enviar Consulta</h2>
            <form onSubmit={enviarPregunta} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Categoría</label>
                <select
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-2 ring-purple-50 focus:ring-[#00d1c4] outline-none transition-all"
                  value={nuevaPregunta.categoria}
                  onChange={(e) => setNuevaPregunta({...nuevaPregunta, categoria: e.target.value})}
                >
                  <option>General</option>
                  <option>Clima</option>
                  <option>Perfil</option>
                  <option>Postulación</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tu pregunta</label>
                <textarea
                  required
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-2 ring-purple-50 focus:ring-[#00d1c4] outline-none h-32 resize-none transition-all"
                  placeholder="Escribe tu duda detalladamente..."
                  onChange={(e) => setNuevaPregunta({...nuevaPregunta, texto: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-[#7e1d91] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3b0f52] transition-colors shadow-lg shadow-purple-100">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ÉXITO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#7e1d91]/90 backdrop-blur-xl">
          <div className="bg-white rounded-[40px] w-full max-w-sm p-10 text-center shadow-2xl animate-in zoom-in-95">
            <div className="bg-[#00d1c4] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00d1c4]/40">
              <Send size={40} className="text-[#3b0f52] ml-1" />
            </div>
            <h2 className="text-3xl font-black text-[#3b0f52] mb-2">¡Recibido!</h2>
            <p className="text-gray-500 mb-8 font-medium">Tu consulta ha sido enviada. Te responderemos en la sección "Mis Consultas" de tu perfil.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#3b0f52] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}