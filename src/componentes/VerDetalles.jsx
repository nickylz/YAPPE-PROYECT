import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { 
  MapPin, Clock, Briefcase, ArrowLeft, 
  CheckCircle, Info, AlignLeft, Send 
} from "lucide-react";

export default function VerDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleo, setEmpleo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const docRef = doc(db, "vacantes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmpleo(docSnap.data());
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDetalle();
  }, [id]);

  // Función para viñetas automáticas (puntos cian)
  const formatearTexto = (texto) => {
    if (!texto) return null;
    return texto.split("\n").map((linea, index) => (
      linea.trim() !== "" && (
        <div key={index} className="flex gap-2 mb-2 items-start">
          <span className="text-[#25d3c9] font-black mt-1">•</span>
          <span className="flex-1">{linea}</span>
        </div>
      )
    ));
  };

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaff]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#7e1d91]"></div>
    </div>
  );

  if (!empleo) return <div className="text-center py-20 font-black text-[#3b0f52]">Empleo no encontrado</div>;

  const labelStyle = "text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.2em] mb-1 block opacity-60";

  return (
    <div className="bg-[#fcfaff] min-h-screen pb-20">
      
      {/* BOTÓN VOLVER (Ajustado para no chocar con Navbar) */}
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-28"> 
        <Link 
          to="/productos" 
          className="group inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-[#7e1d91] hover:text-white transition-all border border-purple-50"
        >
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        
        {/* CABECERA: IMAGEN + INFO RÁPIDA (Responsive: Column en móvil, Row en desktop) */}
        <div className="bg-white rounded-[40px] border-2 border-[#f0e6ff] overflow-hidden shadow-[0_20px_60px_rgba(59,15,82,0.05)] mb-10">
          <div className="flex flex-col md:flex-row">
            {/* Imagen Principal (Jalada de Firebase imagenUrl) */}
            <div className="w-full md:w-1/2 h-[250px] md:h-[450px] relative">
              <img 
                src={empleo.imagenUrl || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop"} 
                className="w-full h-full object-cover" 
                alt={empleo.titulo} 
              />
            </div>

            {/* Info Rápida */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center space-y-6">
              <div>
                <span className="bg-[#25d3c9]/10 text-[#25d3c9] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter mb-4 inline-block">
                  Vacante Activa
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-[#3b0f52] italic uppercase leading-none tracking-tighter">
                  {empleo.titulo}
                </h1>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-8">
                <div>
                  <span className={labelStyle}>Modalidad</span>
                  <div className="flex items-center gap-2 text-[#3b0f52] font-black italic uppercase text-xs md:text-sm">
                    <Clock size={16} className="text-[#7e1d91]" /> {empleo.tipo}
                  </div>
                </div>
                <div>
                  <span className={labelStyle}>Ubicación</span>
                  <div className="flex items-center gap-2 text-[#3b0f52] font-black italic uppercase text-xs md:text-sm">
                    <MapPin size={16} className="text-[#7e1d91]" /> {empleo.ubicacion}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#fcfaff]">
                <span className={labelStyle}>Resumen</span>
                <p className="text-[#3b0f52]/70 font-bold text-base md:text-lg leading-relaxed italic">
                  "{empleo.descripcion}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DETALLES EXTENDIDOS */}
        <div className="space-y-8">
          <section className="bg-white rounded-[35px] p-6 md:p-10 border border-[#f0e6ff] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <AlignLeft size={24} className="text-[#7e1d91]" />
              <h2 className="text-xl font-black text-[#3b0f52] uppercase italic">Descripción del puesto</h2>
            </div>
            <div className="text-gray-600 font-medium leading-loose text-sm md:text-base">
              {formatearTexto(empleo.deslarga)}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[30px] p-6 md:p-8 border border-[#f0e6ff] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={20} className="text-[#25d3c9]" />
                <h3 className="font-black text-[#3b0f52] uppercase italic text-sm">Requisitos</h3>
              </div>
              <div className="text-gray-500 text-xs font-bold leading-relaxed">
                {formatearTexto(empleo.requisitos)}
              </div>
            </section>

            <section className="bg-white rounded-[30px] p-6 md:p-8 border border-[#f0e6ff] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Info size={20} className="text-[#7e1d91]" />
                <h3 className="font-black text-[#3b0f52] uppercase italic text-sm">Cultura y Beneficios</h3>
              </div>
              <div className="text-gray-500 text-xs font-bold leading-relaxed">
                {formatearTexto(empleo.otros)}
              </div>
            </section>
          </div>
        </div>

        {/* BOTÓN DE POSTULACIÓN AL FINAL (Redirige a la página de formulario) */}
        <div className="mt-16 border-t-2 border-dashed border-[#f0e6ff] pt-12 flex flex-col items-center">
          <div className="bg-[#3b0f52] rounded-[40px] p-8 md:p-12 w-full max-w-2xl text-center text-white shadow-2xl relative overflow-hidden">
            
            {/* Decoración visual */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#25d3c9]/10 rounded-full blur-3xl"></div>
            
            <Briefcase size={48} className="mx-auto mb-6 text-[#25d3c9]" />
            <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-2">¿Es tu oportunidad?</h3>
            <p className="text-white/60 mb-8 font-medium text-sm md:text-base">
              Haz clic abajo para completar tu postulación oficial.
            </p>
            
            <button 
              onClick={() => navigate(`/postular/${id}`)}
              className="w-full py-5 bg-[#25d3c9] text-[#3b0f52] rounded-2xl font-black uppercase italic tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              Postular Ahora <Send size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}