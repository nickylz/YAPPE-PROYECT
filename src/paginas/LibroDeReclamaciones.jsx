import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  User, FileText, Send, Loader, CheckCircle2, 
  ArrowLeft, MapPin, AlertCircle, MessageSquare
} from "lucide-react";
import { departamentos, provincias as provinciasData, distritos as distritosData } from '../lib/peru-geo';
import toast from "react-hot-toast";

export default function LibroDeReclamaciones() {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombres: "", apellidos: "", documento: "", email: "",
    telefono: "", direccion: "", departamento: "", provincia: "", distrito: "",
    montoReclamado: "", comentario: "", tipo: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "documento") {
      const val = value.replace(/\D/g, ""); 
      if (val.length <= 8) setForm(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === "telefono") {
      const val = value.replace(/\D/g, ""); 
      if (val.length <= 9) setForm(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === "departamento") setForm(prev => ({ ...prev, departamento: value, provincia: "", distrito: "" }));
    else if (name === "provincia") setForm(prev => ({ ...prev, provincia: value, distrito: "" }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.documento.length !== 8) return toast.error("DNI inválido (8 dígitos)");
    if (form.telefono.length !== 9) return toast.error("Teléfono inválido (9 dígitos)");

    setLoading(true);
    try {
      await addDoc(collection(db, "reclamos"), {
        ...form,
        estado: "pendiente",
        fechaCreacion: serverTimestamp(),
      });
      setStep(3);
      toast.success("Enviado correctamente");
    } catch (err) {
      toast.error("Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarTipo = (tipo) => {
    setForm(prev => ({ ...prev, tipo }));
    setStep(1);
  };

  const inputClass = "w-full px-6 md:px-7 py-4 md:py-5 rounded-[24px] bg-white border-2 border-[#ecd8ff] focus:border-[#7e1d91] outline-none font-bold text-[#3b0f52] shadow-sm transition-all placeholder:text-gray-300 text-sm md:text-base";
  const labelClass = "block text-[10px] font-black text-[#7e1d91] uppercase tracking-[0.3em] mb-2 md:mb-3 ml-4 md:ml-6";

  return (
    // Se añade pb-24 para que no choque con el footer y pt-10 para espacio arriba
    <div className="min-h-screen bg-[#fcfaff] px-4 py-10 md:p-12 pb-24 md:pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* PASO 0: SELECCIÓN DE TIPO */}
        {step === 0 && (
          <div className="space-y-10 md:space-y-16 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-7xl font-black italic text-[#3b0f52] uppercase leading-tight md:leading-none tracking-tighter">
                Libro de <br /> <span className="text-[#7e1d91]">Reclamaciones</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase text-[9px] md:text-[11px] tracking-[0.5em]">Elige una categoría para continuar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <button 
                onClick={() => seleccionarTipo("Reclamo")}
                className="group p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border-2 border-transparent hover:border-[#7e1d91] shadow-[0_20px_50px_rgba(126,29,145,0.05)] hover:shadow-2xl hover:shadow-purple-100 transition-all text-left"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#fcfaff] group-hover:bg-[#7e1d91] rounded-[20px] md:rounded-3xl flex items-center justify-center text-[#7e1d91] group-hover:text-white transition-all mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-black italic text-[#3b0f52] uppercase">Reclamo</h3>
                <p className="text-xs md:text-sm text-gray-400 font-bold leading-relaxed mt-2 uppercase tracking-tight">Inconformidad por el producto adquirido</p>
              </button>

              <button 
                onClick={() => seleccionarTipo("Queja")}
                className="group p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border-2 border-transparent hover:border-[#7e1d91] shadow-[0_20px_50px_rgba(126,29,145,0.05)] hover:shadow-2xl hover:shadow-purple-100 transition-all text-left"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#fcfaff] group-hover:bg-[#7e1d91] rounded-[20px] md:rounded-3xl flex items-center justify-center text-[#7e1d91] group-hover:text-white transition-all mb-6">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-black italic text-[#3b0f52] uppercase">Queja</h3>
                <p className="text-xs md:text-sm text-gray-400 font-bold leading-relaxed mt-2 uppercase tracking-tight">Descontento respecto a la atención</p>
              </button>
            </div>
          </div>
        )}

        {/* PASO 1: DATOS PERSONALES */}
        {step === 1 && (
          <div className="space-y-8 md:space-y-10 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-[#7e1d91] font-black uppercase text-[10px] tracking-widest mb-4 md:mb-6">
                  <ArrowLeft size={16} strokeWidth={3} /> Regresar
                </button>
                <h2 className="text-3xl md:text-4xl font-black italic text-[#3b0f52] uppercase tracking-tighter">Tus Datos</h2>
              </div>
              <span className="hidden md:block text-4xl font-black text-[#7e1d91]/10 uppercase">Paso 01</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div><label className={labelClass}>Nombres</label><input name="nombres" value={form.nombres} onChange={handleChange} className={inputClass} required /></div>
              <div><label className={labelClass}>Apellidos</label><input name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass} required /></div>
              <div><label className={labelClass}>DNI</label><input name="documento" value={form.documento} onChange={handleChange} className={inputClass} maxLength={8} required /></div>
              <div><label className={labelClass}>Celular</label><input name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} maxLength={9} required /></div>
              <div className="md:col-span-2"><label className={labelClass}>E-mail de contacto</label><input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required /></div>
            </div>

            <button type="button" onClick={() => setStep(2)} className="w-full md:w-auto md:float-right bg-[#7e1d91] text-white px-16 py-5 md:py-6 rounded-[24px] md:rounded-[30px] font-black uppercase italic tracking-widest shadow-2xl shadow-purple-200 hover:scale-105 transition-all">Siguiente Paso</button>
          </div>
        )}

        {/* PASO 2: UBICACIÓN Y DETALLE */}
        {step === 2 && (
          <div className="space-y-8 md:space-y-10 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[#7e1d91] font-black uppercase text-[10px] tracking-widest mb-4 md:mb-6">
                  <ArrowLeft size={16} strokeWidth={3} /> Paso Anterior
                </button>
                <h2 className="text-3xl md:text-4xl font-black italic text-[#3b0f52] uppercase tracking-tighter">Detalle Final</h2>
              </div>
              <span className="hidden md:block text-4xl font-black text-[#7e1d91]/10 uppercase">Paso 02</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className={labelClass}>Departamento</label>
                <select name="departamento" value={form.departamento} onChange={handleChange} className={inputClass} required>
                  <option value="">Seleccionar</option>
                  {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Provincia</label>
                <select name="provincia" value={form.provincia} onChange={handleChange} className={inputClass} required disabled={!form.departamento}>
                  <option value="">Provincia</option>
                  {(provinciasData[form.departamento] || []).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Distrito</label>
                <select name="distrito" value={form.distrito} onChange={handleChange} className={inputClass} required disabled={!form.provincia}>
                  <option value="">Distrito</option>
                  {(distritosData[form.provincia] || []).map(dis => <option key={dis.id} value={dis.id}>{dis.nombre}</option>)}
                </select>
              </div>
            </div>

            <div><label className={labelClass}>Dirección Actual</label><input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} required /></div>
            
            <div>
              <label className={labelClass}>¿Qué sucedió?</label>
              <textarea name="comentario" value={form.comentario} onChange={handleChange} className={`${inputClass} h-48 md:h-52 resize-none pt-6`} required placeholder="Describe tu experiencia..." />
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#3b0f52] text-white py-5 md:py-6 rounded-[24px] md:rounded-[30px] font-black text-xl shadow-2xl hover:bg-[#7e1d91] transition-all flex items-center justify-center gap-4">
              {loading ? <Loader className="animate-spin" /> : <><Send size={22} /> Enviar {form.tipo}</>}
            </button>
          </div>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="py-20 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-white text-emerald-500 rounded-[35px] md:rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100 border-2 border-emerald-50">
              <CheckCircle2 size={50} md:size={60} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black italic text-[#3b0f52] uppercase tracking-tighter">¡Listo!</h2>
              <p className="text-gray-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.3em]">Hemos recibido tu mensaje</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-12 md:px-16 py-5 md:py-6 bg-[#7e1d91] text-white rounded-[24px] md:rounded-[30px] font-black uppercase italic shadow-xl hover:scale-105 transition-transform">Volver</button>
          </div>
        )}

      </div>
    </div>
  );
}