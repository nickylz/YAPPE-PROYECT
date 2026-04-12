import { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  User, Mail, Phone, MapPin, FileText, 
  DollarSign, Camera, Send, Loader, CheckCircle2, 
  AlertCircle, X, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";

export default function LibroDeReclamaciones() {
  const [step, setStep] = useState(1); // 1: Selección, 2: Formulario, 3: Éxito
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [form, setForm] = useState({
    nombres: "", apellidos: "", documento: "", email: "",
    telefono: "", direccion: "", departamento: "", provincia: "", distrito: "",
    montoReclamado: "", comentario: "", tipo: "Reclamo"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validación de máximo 5 cifras para el monto
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
      // 1. Subir fotos a Firebase Storage
      for (const foto of fotos) {
        const storageRef = ref(storage, `reclamos/${Date.now()}-${foto.name}`);
        const snapshot = await uploadBytes(storageRef, foto);
        const url = await getDownloadURL(snapshot.ref);
        fotoUrls.push(url);
      }

      // 2. Guardar datos en Firestore
      await addDoc(collection(db, "reclamos"), {
        ...form,
        montoReclamado: parseFloat(form.montoReclamado) || 0,
        fotos: fotoUrls,
        fechaCreacion: serverTimestamp(),
        estado: "pendiente"
      });

      toast.success("Reclamo enviado correctamente");
      setStep(3);
    } catch (error) {
      console.error("Error al enviar reclamo:", error);
      toast.error("Hubo un error al procesar su solicitud");
    } finally {
      setLoading(false);
    }
  };

  // --- VISTA DE ÉXITO ---
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-28 h-28 bg-[#25d3c9]/10 rounded-full flex items-center justify-center mx-auto text-[#25d3c9] shadow-inner">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-[#3b0f52]">¡Reclamo Registrado!</h2>
          <p className="text-[#6b4a88] font-medium max-w-sm mx-auto">
            Hemos recibido tu información correctamente. Un asesor revisará tu caso pronto.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-[#7e1d91] text-white px-12 py-4 rounded-2xl font-black shadow-2xl hover:bg-[#3b0f52] transition-all"
        >
          Finalizar y Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10 animate-in fade-in duration-700">
      
      <div className="w-full">
  {/* Banner de Libro de Reclamaciones con ancho completo (Estilo Intranet) */}
  <div className="w-full bg-gradient-to-r from-[#7e1d91] via-[#8f3cbf] to-[#bd6fe4] shadow-[0_40px_120px_rgba(126,29,145,0.18)] py-16 md:py-20 text-center text-white mb-10">
    <div className="relative z-10">
      <p className="text-sm uppercase tracking-[0.35em] text-[#f3e6ff]/90 mb-4 font-black">
        Servicio de Atención
      </p>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight px-4 md:px-0 italic">
        Libro de Reclamaciones
      </h1>
      <p className="mt-4 text-[#f7ebff]/90 max-w-3xl mx-auto text-base md:text-xl px-4 md:px-0 font-medium">
        Tu opinión es vital. Completa los datos para que podamos gestionar tu inconveniente de manera inmediata.
      </p>
    </div>
  </div>
</div>

      <div className="bg-white rounded-4xl shadow-2xl border border-[#ecd8ff] overflow-hidden">
        
        {/* PASO 1: SELECCIÓN DE INICIO */}
        {step === 1 && (
          <div className="p-12 md:p-20 text-center space-y-10 animate-in slide-in-from-bottom-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#3b0f52]">Bienvenido al Gestor de Reclamos</h3>
              <p className="text-[#6b4a88] max-w-lg mx-auto font-medium">
                De acuerdo a ley, este espacio es para registrar quejas sobre la calidad de nuestros productos o servicios.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setStep(2)}
                className="group relative bg-[#f7f1ff] border-2 border-[#7e1d91] p-10 rounded-4xl w-full max-w-md hover:bg-[#7e1d91] transition-all duration-500 shadow-xl"
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="p-5 bg-[#7e1d91] group-hover:bg-white rounded-3xl transition-all shadow-lg group-hover:rotate-6">
                    <AlertCircle className="text-white group-hover:text-[#7e1d91]" size={40} />
                  </div>
                  <span className="text-2xl font-black text-[#7e1d91] group-hover:text-white uppercase tracking-widest">
                    Iniciar Reclamo
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: EL FORMULARIO */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-16 animate-in slide-in-from-right duration-500">
            
            {/* 1. Datos del Usuario */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-[#f7f1ff] pb-6">
                <div className="p-3 bg-[#7e1d91] rounded-2xl text-white shadow-lg">
                   <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3b0f52]">1. Identificación del Consumidor</h3>
                  <p className="text-xs text-[#6b4a88] font-bold uppercase tracking-wider opacity-60">Datos personales obligatorios</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="nombres" placeholder="Nombres completos" required className="input-style" onChange={handleChange} />
                <input name="apellidos" placeholder="Apellidos completos" required className="input-style" onChange={handleChange} />
                <input name="documento" placeholder="DNI o RUC" required className="input-style" onChange={handleChange} />
                <input name="email" type="email" placeholder="Correo electrónico" required className="input-style" onChange={handleChange} />
                <input name="telefono" placeholder="Número de contacto" required className="input-style" onChange={handleChange} />
                <input name="direccion" placeholder="Dirección exacta" required className="input-style" onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input name="departamento" placeholder="Departamento" className="input-style" onChange={handleChange} />
                <input name="provincia" placeholder="Provincia" className="input-style" onChange={handleChange} />
                <input name="distrito" placeholder="Distrito" className="input-style" onChange={handleChange} />
              </div>
            </div>

            {/* 2. El Detalle */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-[#f7f1ff] pb-6">
                <div className="p-3 bg-[#25d3c9] rounded-2xl text-[#0f172a] shadow-lg">
                   <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3b0f52]">2. Detalles del Reclamo</h3>
                  <p className="text-xs text-[#6b4a88] font-bold uppercase tracking-wider opacity-60">Cuéntanos qué sucedió</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative max-w-xs">
                  <div className="absolute inset-y-0 left-5 flex items-center text-[#7e1d91]">
                    <DollarSign size={20} />
                  </div>
                  <input 
                    name="montoReclamado" 
                    type="number"
                    value={form.montoReclamado}
                    placeholder="Monto (Máx 5 cifras)" 
                    className="input-style pl-14" 
                    onChange={handleChange}
                  />
                </div>
                <textarea 
                  name="comentario" 
                  placeholder="Explica detalladamente el inconveniente, la fecha y el producto/servicio involucrado..." 
                  required 
                  className="input-style h-52 resize-none pt-5"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 3. Evidencias */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-[#f7f1ff] pb-6">
                <div className="p-3 bg-[#ecd8ff] rounded-2xl text-[#7e1d91] shadow-lg">
                   <Camera size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3b0f52]">3. Evidencias Visuales</h3>
                  <p className="text-xs text-[#6b4a88] font-bold uppercase tracking-wider opacity-60">Sube fotos del producto o boleta</p>
                </div>
              </div>

              <div className="relative border-3 border-dashed border-[#ecd8ff] rounded-4xl p-14 text-center hover:bg-[#f7f1ff] hover:border-[#7e1d91]/30 transition-all group cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-[#fcfaff] rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        <ImageIcon size={32} className="text-[#7e1d91]/40" />
                    </div>
                    <div>
                        <p className="text-[#3b0f52] font-black text-lg">Haz clic o arrastra tus fotos</p>
                        <p className="text-[#6b4a88] text-sm font-medium mt-1">
                            {fotos.length > 0 ? `Se han seleccionado ${fotos.length} fotos` : "Formatos permitidos: JPG, PNG, WEBP"}
                        </p>
                    </div>
                </div>
              </div>
            </div>

            {/* BOTONES FINALES */}
            <div className="flex flex-col md:flex-row gap-5 pt-10 border-t border-[#f7f1ff]">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="px-12 py-5 rounded-2xl font-black text-[#7e1d91] bg-[#f7f1ff] hover:bg-[#ecd8ff] transition-all uppercase tracking-widest text-xs"
              >
                Volver
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-[#7e1d91] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-[#3b0f52] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin" /> : <><Send size={20} /> Enviar Reclamo Ahora</>}
              </button>
            </div>
          </form>
        )}
      </div>

      
    </div>
  );
}