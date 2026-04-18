import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase"; 
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { MessageCircle, Clock, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

export default function MisConsultas() {
  const { usuarioActual } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioActual?.uid) return;

    const q = query(
      collection(db, "consultas"),
      where("usuarioId", "==", usuarioActual.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConsultas(docs);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [usuarioActual]);

  // FUNCIÓN PARA ELIMINAR LA CONSULTA
  const eliminarConsulta = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres borrar esta consulta?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "consultas", id));
      alert("Consulta eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la consulta.");
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7e1d91]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <MessageCircle className="text-[#7e1d91]" size={28} />
        <h2 className="text-2xl font-black text-[#4f2f7a] uppercase tracking-tighter">
          Mis Consultas Directas
        </h2>
      </div>

      {consultas.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-[32px] border-2 border-dashed border-purple-100">
          <AlertCircle size={48} className="mx-auto mb-4 text-purple-200" />
          <p className="font-black text-purple-300 uppercase tracking-widest text-sm">
            No tienes consultas activas
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {consultas.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[28px] border border-purple-50 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group"
            >
              {/* BOTÓN DE BORRAR (Esquina superior derecha) */}
              <button 
                onClick={() => eliminarConsulta(item.id)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Eliminar consulta"
              >
                <Trash2 size={18} />
              </button>

              <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 pr-12">
                <div className="flex items-center gap-2">
                  <span className="bg-[#f3e6ff] text-[#7e1d91] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    {item.categoria || "General"}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                    <Clock size={14} />
                    {item.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase ${
                  item.estado === 'pendiente' 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-green-100 text-green-600'
                }`}>
                  {item.estado === 'pendiente' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                  {item.estado}
                </div>
              </div>

              <div className="p-6">
                <p className="text-[#3b0f52] font-extrabold text-lg mb-4 leading-tight">
                  {item.pregunta}
                </p>

                {item.respuesta ? (
                  <div className="mt-4 bg-[#00d1c4]/5 rounded-2xl p-5 border-l-4 border-[#00d1c4]">
                    <p className="text-[#00d1c4] font-black text-[10px] uppercase tracking-widest mb-2">
                      Respuesta del Equipo:
                    </p>
                    <p className="text-[#4f2f7a] font-medium leading-relaxed">
                      {item.respuesta}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-400 italic text-sm">
                    Estamos revisando tu caso...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}