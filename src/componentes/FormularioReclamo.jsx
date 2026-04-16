import { useState } from 'react';
import { db } from '../lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { departamentos, provincias as provinciasData, distritos as distritosData } from '../lib/peru-geo';
import { Send, Loader, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FormularioReclamo({ tipoReclamo, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', numeroDocumento: '', email: '',
    telefono: '', departamento: '', provincia: '', distrito: '',
    montoReclamado: '', descripcionReclamo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Solo números para DNI
    if (name === "numeroDocumento") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 8) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    // Solo números para Teléfono
    if (name === "telefono") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 9) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    // Lógica de Perú-Geo
    if (name === 'departamento') setFormData(prev => ({ ...prev, departamento: value, provincia: '', distrito: '' }));
    else if (name === 'provincia') setFormData(prev => ({ ...prev, provincia: value, distrito: '' }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.numeroDocumento.length !== 8) return toast.error("DNI inválido");
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reclamos'), {
        ...formData,
        tipo: tipoReclamo,
        fechaCreacion: serverTimestamp(),
        estado: 'pendiente'
      });
      toast.success("Enviado correctamente");
      onBack();
    } catch (err) {
      toast.error("Error al enviar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full bg-[#fcfaff] border-2 border-[#ecd8ff] rounded-2xl px-5 py-3 text-[#3b0f52] font-bold focus:border-[#7e1d91] outline-none transition-all";
  const labelStyles = "block text-[10px] font-black text-[#7e1d91] uppercase tracking-widest mb-1.5 ml-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={labelStyles}>Nombres</label><input name="nombres" value={formData.nombres} onChange={handleChange} className={inputStyles} required /></div>
        <div><label className={labelStyles}>Apellidos</label><input name="apellidos" value={formData.apellidos} onChange={handleChange} className={inputStyles} required /></div>
        <div><label className={labelStyles}>DNI</label><input name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} className={inputStyles} required maxLength={8} /></div>
        <div><label className={labelStyles}>Celular</label><input name="telefono" value={formData.telefono} onChange={handleChange} className={inputStyles} required maxLength={9} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelStyles}>Departamento</label>
          <select name="departamento" value={formData.departamento} onChange={handleChange} className={inputStyles} required>
            <option value="">Seleccionar</option>
            {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className={labelStyles}>Provincia</label>
          <select name="provincia" value={formData.provincia} onChange={handleChange} className={inputStyles} required disabled={!formData.departamento}>
            <option value="">Provincia</option>
            {(provinciasData[formData.departamento] || []).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className={labelStyles}>Distrito</label>
          <select name="distrito" value={formData.distrito} onChange={handleChange} className={inputStyles} required disabled={!formData.provincia}>
            <option value="">Distrito</option>
            {(distritosData[formData.provincia] || []).map(dis => <option key={dis.id} value={dis.id}>{dis.nombre}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelStyles}>Descripción</label>
        <textarea name="descripcionReclamo" value={formData.descripcionReclamo} onChange={handleChange} className={`${inputStyles} h-32 resize-none`} required />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-[#7e1d91] text-white py-5 rounded-2xl font-black uppercase italic shadow-lg hover:bg-[#3b0f52] transition-all disabled:opacity-50">
        {isSubmitting ? <Loader className="animate-spin mx-auto" /> : "Enviar Información"}
      </button>
    </form>
  );
}