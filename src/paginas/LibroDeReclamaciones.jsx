import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { 
  User, FileText, Send, Loader, CheckCircle2, 
  ArrowLeft, MapPin, AlertCircle, MessageSquare, ShieldAlert
} from "lucide-react";
// Importación de la base de datos geográfica
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

  // --- LÓGICA DE PROTECCIÓN POR ROLES ---
  const [rol, setRol] = useState(null);
  const [buscandoRol, setBuscandoRol] = useState(true);

  useEffect(() => {
    const obtenerRol = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          if (userDoc.exists()) {
            setRol(userDoc.data().rol);
          }
        }
      } catch (error) {
        console.error("Error al obtener rol:", error);
      } finally {
        setBuscandoRol(false);
      }
    };
    obtenerRol();
  }, []);

  const esStaff = rol === "admin" || rol === "editor";
  // ---------------------------------------

  const [listaProvincias, setListaProvincias] = useState([]);
  const [listaDistritos, setListaDistritos] = useState([]);

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

    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "departamento") {
      setListaProvincias(provinciasData[value] || []);
      setListaDistritos([]);
      setForm(prev => ({ ...prev, departamento: value, provincia: "", distrito: "" }));
    }
    
    if (name === "provincia") {
      setListaDistritos(distritosData[value] || []);
      setForm(prev => ({ ...prev, provincia: value, distrito: "" }));
    }
  };

  const handleSubmit = async () => {
    if (esStaff) {
      return toast.error("El personal administrativo no puede registrar reclamos.");
    }

    if (!form.comentario || !form.tipo) {
      return toast.error("Por favor, completa el detalle de tu solicitud.");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "reclamaciones"), {
        ...form,
        fecha: serverTimestamp(),
        estado: "Pendiente"
      });
      setStep(3);
      toast.success("Enviado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#fcfaff] border-2 border-[#f0ebf5] rounded-2xl px-6 py-4 text-[#3b0f52] font-semibold focus:border-[#7e1d91] focus:ring-4 focus:ring-[#7e1d91]/5 transition-all outline-none placeholder:text-gray-300 placeholder:font-normal disabled:opacity-50 disabled:cursor-not-allowed";
  const labelStyle = "block text-xs font-black text-[#3b0f52] uppercase tracking-[0.2em] mb-3 ml-2 italic";

  return (
    <div className="min-h-screen bg-[#fcfaff] py-12 px-4 md:py-20 font-sans text-left">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] md:rounded-[60px] shadow-[0_40px_100px_rgba(59,15,82,0.1)] border border-[#f0e4ff] overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#3b0f52] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7e1d91] rounded-full -mr-32 -mt-32 opacity-20 animate-pulse"></div>
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter relative z-10">Libro de <br/> <span className="text-[#00d1c4]">Reclamaciones</span></h1>
          <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mt-4 relative z-10">Tu opinión nos ayuda a mejorar</p>
        </div>

        {/* ALERTA DE ROL (STAFF) */}
        {esStaff && (
          <div className="mx-8 mt-8 md:mx-16 flex items-center gap-4 p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] animate-in fade-in zoom-in-95">
            <ShieldAlert className="text-red-500" size={32} />
            <div>
              <p className="text-red-600 font-black uppercase text-xs tracking-widest italic">Acceso restringido</p>
              <p className="text-red-400 text-sm font-bold">Como {rol}, solo puedes visualizar este módulo pero no enviar datos.</p>
            </div>
          </div>
        )}

        {/* PASO 0: SELECCIÓN DE TIPO */}
        {step === 0 && (
          <div className="p-8 md:p-16 space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-[#3b0f52] uppercase italic">¿Qué deseas realizar?</h2>
              <p className="text-gray-400 font-medium">Selecciona una opción para continuar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                disabled={esStaff}
                onClick={() => { setForm(prev => ({ ...prev, tipo: "Reclamo" })); setStep(1); }} 
                className={`group p-8 bg-[#fcfaff] border-2 border-[#f0ebf5] rounded-[35px] transition-all text-left space-y-4 ${esStaff ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#7e1d91]'}`}
              >
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#7e1d91] shadow-sm transition-colors ${!esStaff && 'group-hover:bg-[#7e1d91] group-hover:text-white'}`}>
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3b0f52] uppercase italic">Reclamo</h3>
                  <p className="text-sm text-gray-400 font-medium">Disconformidad relacionada a algún retraso o mal funcionamiento.</p>
                </div>
              </button>
              <button 
                disabled={esStaff}
                onClick={() => { setForm(prev => ({ ...prev, tipo: "Queja" })); setStep(1); }} 
                className={`group p-8 bg-[#fcfaff] border-2 border-[#f0ebf5] rounded-[35px] transition-all text-left space-y-4 ${esStaff ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#00d1c4]'}`}
              >
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#00d1c4] shadow-sm transition-colors ${!esStaff && 'group-hover:bg-[#00d1c4] group-hover:text-white'}`}>
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3b0f52] uppercase italic">Queja</h3>
                  <p className="text-sm text-gray-400 font-medium">Malestar o descontento respecto a la atención al público.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PASO 1: DATOS PERSONALES Y UBICACIÓN */}
        {step === 1 && (
          <div className="p-8 md:p-16 space-y-12 animate-in fade-in slide-in-from-right-4">
            <button onClick={() => setStep(0)} className="flex items-center gap-2 text-[#7e1d91] font-black uppercase text-xs tracking-widest hover:opacity-50 transition-all">
              <ArrowLeft size={16} /> Volver
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelStyle}>Nombres</label>
                <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Ej. Juan Gabriel" className={inputStyle} disabled={esStaff} />
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Apellidos</label>
                <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Ej. Quispe Mamani" className={inputStyle} disabled={esStaff} />
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>DNI / CE (8 dígitos)</label>
                <input name="documento" value={form.documento} onChange={handleChange} placeholder="Ej. 74859612" className={inputStyle} disabled={esStaff} />
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Correo Electrónico</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ejemplo@gmail.com" className={inputStyle} disabled={esStaff} />
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Teléfono / WhatsApp</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Ej. 912345678" className={inputStyle} disabled={esStaff} />
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Dirección Exacta</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ej. Av. Las Flores 123 - Int. 4" className={inputStyle} disabled={esStaff} />
              </div>

              <div className="space-y-2">
                <label className={labelStyle}>Departamento</label>
                <select name="departamento" value={form.departamento} onChange={handleChange} className={inputStyle} disabled={esStaff}>
                  <option value="">Selecciona...</option>
                  {departamentos.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Provincia</label>
                <select name="provincia" value={form.provincia} onChange={handleChange} className={inputStyle} disabled={!form.departamento || esStaff}>
                  <option value="">Selecciona...</option>
                  {listaProvincias.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className={labelStyle}>Distrito</label>
                <select name="distrito" value={form.distrito} onChange={handleChange} className={inputStyle} disabled={!form.provincia || esStaff}>
                  <option value="">Selecciona...</option>
                  {listaDistritos.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-[#7e1d91] text-white py-6 rounded-[30px] font-black text-xl shadow-xl shadow-[#7e1d91]/20 hover:bg-[#3b0f52] transition-all flex items-center justify-center gap-4 uppercase italic tracking-widest">
              Siguiente Paso <ArrowLeft size={22} className="rotate-180" />
            </button>
          </div>
        )}

        {/* PASO 2: DETALLE DEL RECLAMO */}
        {step === 2 && (
          <div className="p-8 md:p-16 space-y-10 animate-in fade-in slide-in-from-right-4">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[#7e1d91] font-black uppercase text-xs tracking-widest hover:opacity-50 transition-all">
              <ArrowLeft size={16} /> Volver
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelStyle}>Monto Reclamado (Opcional)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#7e1d91]">S/</span>
                  <input name="montoReclamado" value={form.montoReclamado} onChange={handleChange} placeholder="0.00" className={`${inputStyle} pl-12`} disabled={esStaff} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Detalle de su {form.tipo}</label>
                <textarea name="comentario" value={form.comentario} onChange={handleChange} rows="6" placeholder="Cuéntanos detalladamente lo sucedido..." className={`${inputStyle} resize-none`} disabled={esStaff}></textarea>
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading || esStaff || buscandoRol} 
              className={`w-full py-6 rounded-[30px] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 uppercase italic tracking-widest 
                ${esStaff ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#3b0f52] text-white hover:bg-[#7e1d91]'}`}
            >
              {buscandoRol ? (
                <Loader className="animate-spin" />
              ) : loading ? (
                <Loader className="animate-spin" />
              ) : esStaff ? (
                "Acceso Denegado"
              ) : (
                <><Send size={22} /> Enviar {form.tipo}</>
              )}
            </button>
          </div>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="py-20 px-8 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-32 h-32 bg-white text-emerald-500 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100 border-2 border-emerald-50">
              <CheckCircle2 size={60} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black italic text-[#3b0f52] uppercase tracking-tighter">¡Registrado!</h2>
              <p className="text-gray-400 font-bold max-w-sm mx-auto">Tu solicitud ha sido recibida. Nos comunicaremos contigo en un plazo máximo de 15 días hábiles.</p>
            </div>
            <button onClick={() => window.location.href = '/'} className="bg-[#7e1d91] text-white px-12 py-5 rounded-full font-black uppercase italic tracking-widest hover:scale-105 transition-transform shadow-lg shadow-purple-100">
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}