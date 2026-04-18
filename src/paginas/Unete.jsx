import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, ArrowRight, Briefcase, Loader } from "lucide-react";
import empleoImg from "../componentes/img/empleo.png";

export default function Unete() {
  const [vacantes, setVacantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (!db) throw new Error("Base de datos no conectada");
        const querySnapshot = await getDocs(collection(db, "vacantes"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVacantes(docs);
      } catch (error) {
        console.error("Error al traer vacantes:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  const resultados = (vacantes || []).filter((job) => {
    const term = busqueda.toLowerCase();
    return (
      (job?.titulo || "").toLowerCase().includes(term) ||
      (job?.ubicacion || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-[#fcfaff] min-h-screen font-sans text-left">
      
      {/* HERO SECTION */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${empleoImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b0f52]/90 to-[#7e1d91]/70"></div>
        </div>
        <div className="relative z-10 px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6">
            Oportunidades <br /> <span className="text-[#00d1c4]">para brillar</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Encuentra el lugar perfecto para crecer profesionalmente.
          </p>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-[32px] p-2 shadow-[0_20px_50px_rgba(59,15,82,0.15)] border border-purple-50 flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7e1d91]" size={24} />
            <input
              type="text"
              placeholder="¿Qué puesto buscas?"
              className="w-full py-5 pl-16 pr-6 rounded-[24px] bg-[#fcfaff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00d1c4] transition-all text-[#3b0f52] font-semibold"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="bg-[#7e1d91] text-white px-10 py-5 rounded-[24px] font-black hover:bg-[#3b0f52] transition-colors w-full md:w-auto uppercase tracking-wider text-sm">
            Buscar
          </button>
        </div>
      </div>

      {/* GRILLA DE VACANTES */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-[#3b0f52]">Vacantes disponibles</h2>
          <span className="bg-[#00d1c4]/10 text-[#009b94] px-4 py-2 rounded-full font-black text-sm uppercase">
            {resultados.length} Posiciones
          </span>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-16 h-16 text-[#7e1d91] animate-spin mb-4" />
            <p className="text-[#6b4a88] font-black animate-pulse uppercase tracking-widest text-xs">Cargando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultados.length > 0 ? (
              resultados.map((job) => (
                <div key={job.id} className="group bg-white rounded-[40px] p-8 shadow-sm hover:shadow-[0_30px_60px_rgba(59,15,82,0.1)] border border-purple-50 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-[#fcfaff] rounded-[24px] text-[#7e1d91]">
                        <Briefcase size={28} />
                      </div>
                      <span className="text-[10px] font-black text-[#00d1c4] border-2 border-[#00d1c4] px-3 py-1 rounded-full uppercase tracking-widest">
                        {job?.tipo || "Full Time"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#3b0f52] mb-3 group-hover:text-[#7e1d91] transition-colors leading-tight">
                      {job?.titulo || "Puesto disponible"}
                    </h3>

                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex items-center gap-2 text-[#6b4a88] font-semibold text-sm">
                        <MapPin size={16} className="text-[#00d1c4]" />
                        {job?.ubicacion || "Perú"}
                      </div>
                      <div className="flex items-center gap-2 text-[#6b4a88] font-semibold text-sm">
                        <Clock size={16} className="text-[#00d1c4]" />
                        Postulación abierta
                      </div>
                    </div>

                    <p className="text-[#6b4a88]/80 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {job?.descripcion || "Haz clic en ver detalles para conocer más sobre esta posición."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-purple-50">
                      <Link
                        to={`/detalles-empleo/${job.id}`}
                        className="w-full flex items-center justify-center gap-3 bg-[#fcfaff] text-[#7e1d91] font-black py-4 rounded-2xl border-2 border-[#f0ebf5] hover:bg-[#7e1d91] hover:text-white hover:border-[#7e1d91] transition-all uppercase text-xs tracking-[0.2em] group/btn"
                      >
                        Ver detalles 
                        <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <h4 className="text-2xl font-black text-[#3b0f52]">No hay vacantes similares</h4>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}