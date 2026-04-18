import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { Search, ChevronDown, MessageCircle, X, LogIn, Send, ShieldAlert, Loader } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CentrodeAyuda() {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  // --- LÓGICA DE PROTECCIÓN POR ROLES ---
  const [rol, setRol] = useState(null);
  const [buscandoRol, setBuscandoRol] = useState(true);

  useEffect(() => {
    const obtenerRol = async () => {
      if (usuarioActual) {
        try {
          const userDoc = await getDoc(doc(db, "usuarios", usuarioActual.uid));
          if (userDoc.exists()) {
            setRol(userDoc.data().rol);
          }
        } catch (error) {
          console.error("Error al obtener rol:", error);
        } finally {
          setBuscandoRol(false);
        }
      } else {
        setBuscandoRol(false);
      }
    };
    obtenerRol();
  }, [usuarioActual]);

  const esStaff = rol === "admin" || rol === "editor";
  // ---------------------------------------

  const [preguntas, setPreguntas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catActiva, setCatActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [abiertoId, setAbiertoId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({ texto: '', categoria: 'General' });

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
    } else if (esStaff) {
      toast.error("El personal administrativo no puede enviar consultas.");
    } else {
      setShowModal(true);
    }
  };

  const enviarPregunta = async (e) => {
    e.preventDefault();
    if (esStaff) return;

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
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
            Centro de <span className="text-[#00d1c4]">Ayuda</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto font-medium">¿Tienes dudas? Estamos aquí para que todo fluya.</p>
          
          <div className="max-w-2xl mx-auto relative px-4">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#7e1d91]" size={20} />
            <input 
              type="text"
              placeholder="Escribe tu duda aquí..."
              className="w-full py-5 pl-14 pr-6 rounded-[24px] bg-white shadow-2xl focus:ring-4 focus:ring-[#00d1c4]/30 outline-none text-[#3b0f52] font-semibold"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto py-12 px-4">
        
        {/* ALERTA DE ROL (STAFF) - Agregado igual que en el Libro de Reclamaciones */}
        {esStaff && (
          <div className="mb-10 flex items-center gap-4 p-6 bg-red-50 border-2 border-red-100 rounded-[2.5rem] animate-in fade-in zoom-in-95">
            <ShieldAlert className="text-red-500" size={32} />
            <div>
              <p className="text-red-600 font-black uppercase text-xs tracking-widest italic">Acceso restringido</p>
              <p className="text-red-400 text-sm font-bold">Como {rol}, puedes ver las FAQs pero no enviar consultas directas.</p>
            </div>
          </div>
        )}

        {/* FILTRO DE CATEGORÍAS */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCatActiva(cat)}
              className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.15em] transition-all ${
                catActiva === cat 
                ? 'bg-[#00d1c4] text-[#3b0f52] shadow-lg shadow-cyan-200' 
                : 'bg-white text-[#7e1d91] border border-purple-100 hover:bg-purple-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTA DE ACORDEONES */}
        <div className="space-y-4">
          {filtrados.length > 0 ? (
            filtrados.map((item) => (
              <div key={item.id} className="bg-white rounded-[28px] border border-purple-50 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <button 
                  onClick={() => setAbiertoId(abiertoId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center p-7 text-left"
                >
                  <span className="font-black text-[#3b0f52] text-lg pr-4">{item.pregunta}</span>
                  <ChevronDown className={`text-[#7e1d91] transition-transform duration-300 ${abiertoId === item.id ? 'rotate-180' : ''}`} />
                </button>
                {abiertoId === item.id && (
                  <div className="px-7 pb-7 text-[#6b4a88] font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                    <div className="h-[2px] bg-[#fcfaff] mb-4"></div>
                    {item.respuesta}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 opacity-40">
              <Search size={48} className="mx-auto mb-4 text-[#7e1d91]" />
              <p className="font-black uppercase tracking-widest text-sm">No hay coincidencias</p>
            </div>
          )}
        </div>

        {/* SECCIÓN FINAL CONTACTO */}
        <div className={`mt-16 rounded-[40px] p-10 text-center text-white relative overflow-hidden shadow-2xl transition-all ${esStaff ? 'bg-gray-400' : 'bg-[#3b0f52]'}`}>
            <div className="relative z-10">
                <MessageCircle size={44} className={`mx-auto mb-4 ${esStaff ? 'text-gray-200' : 'text-[#00d1c4]'}`} />
                <h3 className="text-2xl font-black mb-2 uppercase italic">¿Aún con dudas?</h3>
                <p className="mb-8 text-white/70 font-medium">Escríbenos y un experto te responderá directamente en tu perfil.</p>
                <button 
                  disabled={esStaff}
                  onClick={manejarClickContacto}
                  className={`px-10 py-5 rounded-[22px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl ${
                    esStaff ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' : 'bg-[#00d1c4] text-[#3b0f52] hover:scale-105 active:scale-95'
                  }`}
                >
                    {esStaff ? "Función deshabilitada para staff" : "Hacer una pregunta directa"}
                </button>
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full -mb-20 -mr-10"></div>
        </div>
      </main>

      {/* --- MODALES --- */}

      {/* MODAL 1: AUTH REQUERIDA (Actualizado como alert) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-sm p-10 text-center relative animate-in zoom-in-95 shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="bg-[#7e1d91]/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <LogIn size={40} className="text-[#7e1d91]" />
            </div>
            <h2 className="text-2xl font-black text-[#3b0f52] mb-4 tracking-tighter uppercase italic">¡Identifícate!</h2>
            <p className="text-[#6b4a88] mb-8 font-bold leading-tight">Para enviar una pregunta directa, necesitas iniciar sesión con tu cuenta de usuario.</p>
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full bg-[#3b0f52] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: FORMULARIO (Protegido adicionalmente) */}
      {showModal && !esStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 relative animate-in zoom-in-95 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-[#3b0f52] mb-8 uppercase italic tracking-tighter">Enviar <span className="text-[#7e1d91]">Consulta</span></h2>
            <form onSubmit={enviarPregunta} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-2">Categoría</label>
                <select
                  className="w-full p-5 rounded-2xl bg-[#fcfaff] border-2 border-[#f0ebf5] font-bold text-[#3b0f52] focus:border-[#00d1c4] outline-none transition-all"
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
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-2">Tu pregunta</label>
                <textarea
                  required
                  className="w-full p-5 rounded-2xl bg-[#fcfaff] border-2 border-[#f0ebf5] font-bold text-[#3b0f52] focus:border-[#00d1c4] outline-none h-40 resize-none transition-all placeholder:font-normal placeholder:text-gray-300"
                  placeholder="Describe tu duda paso a paso..."
                  onChange={(e) => setNuevaPregunta({...nuevaPregunta, texto: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-[#7e1d91] text-white py-5 rounded-[22px] font-black uppercase tracking-widest hover:bg-[#3b0f52] transition-all shadow-xl shadow-purple-100">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ÉXITO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3b0f52]/90 backdrop-blur-xl">
          <div className="bg-white rounded-[50px] w-full max-w-sm p-12 text-center shadow-2xl animate-in zoom-in-95">
            <div className="bg-[#00d1c4] w-24 h-24 rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#00d1c4]/30">
              <Send size={44} className="text-[#3b0f52] ml-1" />
            </div>
            <h2 className="text-4xl font-black text-[#3b0f52] mb-3 uppercase italic tracking-tighter">¡Listo!</h2>
            <p className="text-gray-500 mb-10 font-bold leading-tight">Tu consulta está en camino. Atento a tu perfil para la respuesta.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#3b0f52] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}