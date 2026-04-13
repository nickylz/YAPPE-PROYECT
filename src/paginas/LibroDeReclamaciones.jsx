import { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  User, FileText, Camera, Send, Loader, CheckCircle2, 
  AlertCircle, Image as ImageIcon, ArrowLeft, DollarSign
} from "lucide-react";
import toast from "react-hot-toast";

export default function LibroDeReclamaciones() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [form, setForm] = useState({
    nombres: "", apellidos: "", documento: "", email: "",
    telefono: "", direccion: "", departamento: "", provincia: "", distrito: "",
    montoReclamado: "", comentario: "", tipo: "Reclamo"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "montoReclamado" && value.length > 5) return;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fotoUrls = [];
      for (const foto of fotos) {
        const storageRef = ref(storage, `reclamos/${Date.now()}-${foto.name}`);
        const snapshot = await uploadBytes(storageRef, foto);
        const url = await getDownloadURL(snapshot.ref);
        fotoUrls.push(url);
      }

      await addDoc(collection(db, "reclamos"), {
        ...form,
        montoReclamado: parseFloat(form.montoReclamado) || 0,
        fotos: fotoUrls,
        fechaCreacion: serverTimestamp(),
        estado: "pendiente"
      });

      toast.success("¡Enviado con éxito!");
      setStep(3);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  // Input base con Tailwind puro
  const inputClass = "w-full px-6 py-4 bg-white border-2 border-[#f0ebf5] rounded-[20px] text-[#3b0f52] font-semibold transition-all placeholder:text-[#6b4a88]/40 placeholder:font-normal focus:outline-none focus:border-[#00d1c4] focus:ring-4 focus:ring-[#00d1c4]/10";

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-purple-50 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-[#00d1c4]/10 rounded-full flex items-center justify-center mx-auto text-[#00d1c4] mb-8">
            <CheckCircle2 size={56} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-[#3b0f52] mb-4">¡Listo, Yaper@!</h2>
          <p className="text-[#6b4a88] font-medium mb-10 leading-relaxed">
            Hemos registrado tu reclamo correctamente. Nuestro equipo lo revisará en breve.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-[#7e1d91] text-white py-4 rounded-[20px] font-black shadow-lg shadow-purple-200 hover:scale-[1.02] transition-transform"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaff] pb-20 font-sans">
      
      {/* HERO SECTION */}
      <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden flex items-center justify-center text-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://www.yape.com.pe/static/867f08c5c7d5c7b39a7b6b3e9d3d9e8c/banner-vibrayape.png')` }} 
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#3b0f52]/80 via-[#7e1d91]/75 to-[#fcfaff]"></div>
        </div>

        <div className="relative z-10 px-4 mt-[-20px]">
          <span className="inline-block px-5 py-2 bg-[#00d1c4] text-[#3b0f52] text-[11px] font-black uppercase tracking-[0.25em] rounded-full mb-6 shadow-xl">
            Atención al Cliente
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic leading-none drop-shadow-sm">
            Libro de <br /> Reclamaciones
          </h1>
          <p className="mt-8 text-white/95 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            En Yape nos importa escucharte. Cuéntanos qué pasó para ayudarte a que tu vida siga fluyendo.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-[48px] shadow-[0_40px_100px_rgba(59,15,82,0.12)] border border-purple-50 overflow-hidden">
          
          {step === 1 && (
            <div className="p-12 md:p-24 text-center space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-black text-[#3b0f52]">¿Deseas registrar una queja?</h3>
                <p className="text-[#6b4a88] max-w-md mx-auto font-medium text-lg leading-relaxed">
                  Este espacio es exclusivo para reportar inconvenientes con la calidad de nuestros servicios o productos.
                </p>
              </div>
              
              <button 
                onClick={() => setStep(2)}
                className="group relative bg-[#fcfaff] border-2 border-[#7e1d91] p-14 rounded-[44px] w-full max-w-md hover:bg-[#7e1d91] transition-all duration-500 shadow-xl mx-auto block overflow-hidden"
              >
                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="p-6 bg-[#7e1d91] group-hover:bg-white rounded-[30px] transition-all shadow-lg group-hover:scale-110">
                    <AlertCircle className="text-white group-hover:text-[#7e1d91]" size={48} />
                  </div>
                  <span className="text-2xl font-black text-[#7e1d91] group-hover:text-white uppercase tracking-widest">
                    Empezar Registro
                  </span>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="p-8 md:p-20 space-y-20 animate-in slide-in-from-bottom-10 duration-700">
              
              {/* Sección 1: Datos Personales */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-[#7e1d91] rounded-[24px] text-white shadow-lg shadow-purple-100">
                     <User size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#3b0f52]">1. Tus Datos</h3>
                    <p className="text-[10px] text-[#00d1c4] font-black uppercase tracking-[0.2em]">Información personal</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Nombres</label>
                    <input name="nombres" placeholder="Ej. Juan Diego" required className={inputClass} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Apellidos</label>
                    <input name="apellidos" placeholder="Ej. Pérez" required className={inputClass} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Documento (DNI/RUC)</label>
                    <input name="documento" placeholder="Número de ID" required className={inputClass} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Email</label>
                    <input name="email" type="email" placeholder="correo@ejemplo.com" required className={inputClass} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Celular</label>
                    <input name="telefono" placeholder="999 999 999" required className={inputClass} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Dirección</label>
                    <input name="direccion" placeholder="Calle / Av / Jr" required className={inputClass} onChange={handleChange} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#fcfaff] p-8 rounded-[32px] border border-[#f0ebf5]">
                  <input name="departamento" placeholder="Departamento" className={inputClass} onChange={handleChange} />
                  <input name="provincia" placeholder="Provincia" className={inputClass} onChange={handleChange} />
                  <input name="distrito" placeholder="Distrito" className={inputClass} onChange={handleChange} />
                </div>
              </div>

              {/* Sección 2: El Reclamo */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-[#00d1c4] rounded-[24px] text-[#3b0f52] shadow-lg shadow-cyan-50">
                     <FileText size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#3b0f52]">2. El Reclamo</h3>
                    <p className="text-[10px] text-[#7e1d91] font-black uppercase tracking-[0.2em]">Detalle del incidente</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="max-w-xs space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Monto reclamado (S/)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-6 flex items-center text-[#7e1d91] font-black">S/</div>
                      <input 
                        name="montoReclamado" 
                        type="number"
                        value={form.montoReclamado}
                        placeholder="0.00" 
                        className={`${inputClass} pl-14`} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#3b0f52] uppercase ml-1 opacity-60">Descripción de los hechos</label>
                    <textarea 
                      name="comentario" 
                      placeholder="Explícanos detalladamente qué sucedió..." 
                      required 
                      className={`${inputClass} h-52 resize-none pt-6 leading-relaxed`}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Evidencias */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-white rounded-[24px] text-[#7e1d91] border-2 border-[#f0ebf5]">
                     <Camera size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#3b0f52]">3. Evidencias</h3>
                    <p className="text-[10px] text-[#6b4a88]/60 font-black uppercase tracking-[0.2em]">Adjunta fotos o capturas</p>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="file" multiple accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-4 border-dashed border-[#f0ebf5] rounded-[48px] p-16 text-center group-hover:bg-[#fcfaff] group-hover:border-[#7e1d91]/20 transition-all duration-300">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
                      <ImageIcon size={40} className="text-[#7e1d91]" />
                    </div>
                    <p className="text-[#3b0f52] font-black text-2xl">
                      {fotos.length > 0 ? `¡${fotos.length} fotos listas!` : "Subir archivos"}
                    </p>
                    <p className="text-[#6b4a88] font-medium mt-3">Arrastra tus fotos o haz clic aquí</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-[#f0ebf5]">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-3 px-12 py-5 rounded-[24px] font-black text-[#7e1d91] bg-[#fcfaff] hover:bg-purple-100 transition-all uppercase text-xs tracking-widest"
                >
                  <ArrowLeft size={18} strokeWidth={3} /> Volver
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-[#7e1d91] text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-purple-200 hover:bg-[#3b0f52] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {loading ? <Loader className="animate-spin" /> : <><Send size={24} strokeWidth={3} /> ENVIAR RECLAMO</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}