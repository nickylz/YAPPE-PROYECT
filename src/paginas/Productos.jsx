import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase"; // Importamos la db que configuramos antes
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
export default function Productos() {
  const [vacantes, setVacantes] = useState([]); // Empezamos con lista vacía
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // 1. Traer los datos de Firebase al cargar la página
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vacantes"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVacantes(docs);
        setCargando(false);
      } catch (error) {
        console.error("Error al traer vacantes:", error);
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  // 2. Lógica de filtrado (igual que antes, pero con los datos de FB)
  const resultados = vacantes.filter((job) => {
    if (busqueda === "") {
      return true; // Muestra todo al inicio
    }
    return (
      job.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      job.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  return (
    <div className="bg-[#fff3f0] min-h-screen pt-19 pb-20 p-4 font-sans">
      {/* Buscador */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por puesto o ciudad..."
            className="w-full p-4 pl-12 rounded-2xl border-2 border-[#7422ff] focus:outline-none focus:ring-2 focus:ring-[#7422ff] shadow-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="absolute left-4 top-4 text-[#7422ff]">🔍</span>
        </div>
      </div>

      {/* Lista de vacantes */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {cargando ? (
          <p className="text-center text-[#7422ff] font-bold">
            Cargando vacantes...
          </p>
        ) : resultados.length > 0 ? (
          resultados.map((job) => (
            <div
              key={job.id}
              className="bg-white border-2 border-[#b8ffde] rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between h-full"
            >
              {/* 1. ARRIBA: Título y Ubicación */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black text-[#7422ff] mb-1 leading-tight">
                    {job.titulo}
                  </h3>
                  <p className="text-sm text-gray-500">{job.ubicacion}</p>
                </div>
                <span className="text-[#00d1ce] font-mono text-xs font-bold uppercase tracking-widest">
                  {job.tipo}
                </span>
              </div>

              {/* 2. MEDIO: La descripción con espacio (mb-6) */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.descripcion}
                </p>
              </div>

              {/* 3. ABAJO: El botón de postula solo al final */}
              <div className="flex justify-end mt-auto">
                <Link
                  to={`/postular/${job.id}`}
                  className="text-[#00d1ce] font-bold border-b-2 border-[#00d1ce] transform transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  Postula aquí
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            No encontramos nada para "{busqueda}"
          </p>
        )}
      </section>
    </div>
  );
}
