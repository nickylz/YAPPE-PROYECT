import React, { useState, useEffect } from 'react';
import { db } from "../firebase/config"; // Asegúrate de que la ruta a tu config sea correcta
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";

const Preguntas = () => {
  const [categorias, setCategorias] = useState(['General', 'Soporte']);
  const [datos, setDatos] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('General');

  // 1. Leer datos de Firebase en tiempo real
  useEffect(() => {
    const q = query(collection(db, "preguntas"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDatos(docs);
      
      // Actualizar lista de categorías únicas basadas en los documentos
      const catsExistentes = [...new Set(docs.map(d => d.categoria))];
      setCategorias(prev => [...new Set([...prev, ...catsExistentes])]);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subir nueva pregunta a Firestore
  const agregarPregunta = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "preguntas"), {
        categoria: catSeleccionada,
        pregunta,
        respuesta,
        createdAt: new Date()
      });
      setPregunta('');
      setRespuesta('');
    } catch (error) {
      console.error("Error al subir:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulario simple */}
      <section className="bg-[#f7efff] p-6 rounded-3xl border border-[#e6d7ff]">
        <h3 className="text-[#4f2f7a] font-bold mb-4">Agregar Nueva Pregunta</h3>
        <form onSubmit={agregarPregunta} className="grid grid-cols-1 gap-4">
          <select 
            value={catSeleccionada}
            onChange={(e) => setCatSeleccionada(e.target.value)}
            className="p-3 rounded-xl border border-[#ece0ff] text-sm"
          >
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Pregunta" 
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className="p-3 rounded-xl border border-[#ece0ff] text-sm"
            required
          />
          <textarea 
            placeholder="Respuesta" 
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            className="p-3 rounded-xl border border-[#ece0ff] text-sm h-24"
            required
          />
          <button type="submit" className="bg-[#7e1d91] text-white py-3 rounded-xl font-bold hover:bg-[#8f3cbf] transition-colors">
            Subir a la Nube
          </button>
        </form>
      </section>

      {/* Listado */}
      <div className="space-y-6">
        {categorias.map(cat => (
          <div key={cat}>
            <h4 className="text-[#7e1d91] font-bold text-xs uppercase tracking-widest mb-3">{cat}</h4>
            <div className="grid gap-3">
              {datos.filter(d => d.categoria === cat).map(item => (
                <div key={item.id} className="p-4 bg-white border border-[#f0e6ff] rounded-2xl shadow-sm">
                  <p className="font-bold text-[#4f2f7a]">{item.pregunta}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.respuesta}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preguntas;