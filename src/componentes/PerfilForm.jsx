import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { format } from 'date-fns';
import { Edit2, Loader } from 'lucide-react';

const getInitials = (name) => {
    if (!name) return "?";
    const words = name.split(' ');
    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export default function PerfilForm() {
  const { usuarioActual, actualizarPerfil, cargando: cargandoAuth } = useAuth();

  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre || '');
      setUsername(usuarioActual.username || '');
      setImagePreview(usuarioActual.fotoURL || null);
    }
  }, [usuarioActual]);

  const handleFileSelect = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Límite de 5MB
    if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. El límite es de 5MB.");
        return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await actualizarPerfil({ nombre, username, imageFile });
    } catch (error) {
      // El contexto ya se encarga de mostrar el toast de error
      console.error("Error capturado en el formulario:", error);
    } finally {
      setIsSubmitting(false);
      // Reseteamos el input de archivo para poder seleccionar el mismo otra vez si se desea
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    }
  };

  if (cargandoAuth || !usuarioActual) {
    return <div className="text-center p-10"><Loader className="animate-spin mx-auto text-rose-500" /></div>;
  }

  const fechaFormateada = usuarioActual.fechaCreacion?.toDate ? format(usuarioActual.fechaCreacion.toDate(), 'dd/MM/yyyy') : 'No disponible';

  return (
    <div>
      <div className="bg-white rounded-4xl shadow-[0_28px_90px_rgba(126,29,145,0.12)] p-6 mb-8 border border-[#ecd8ff]">
        <div className="flex flex-col gap-6 sm:flex-row items-center">
          <div className="relative group w-28 h-28 shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#7e1d91] flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white text-4xl font-bold">{getInitials(nombre)}</span>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />

            <button
              type="button"
              onClick={handleFileSelect}
              disabled={isSubmitting}
              className="absolute inset-0 rounded-full bg-[#7e1d91]/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {isSubmitting ? <Loader className="animate-spin" /> : <Edit2 size={24} />}
            </button>
          </div>

          <div className="text-center sm:text-left w-full overflow-hidden">
            <p className="text-sm uppercase tracking-[0.24em] text-[#7e1d91]/80 mb-2">Mi perfil</p>
            <h2 className="text-3xl font-bold text-[#3b0f52] wrap-break-word">{usuarioActual.nombre || 'Usuario'}</h2>
            <p className="text-[#6b4a88] mt-2 break-all">{usuarioActual.correo}</p>
            <div className="text-[#7c5fa3] text-sm mt-4 space-y-1">
              <p className="break-all">UID: {usuarioActual.uid}</p>
              <p>Miembro desde: {fechaFormateada}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e6d7ff] rounded-4xl p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-[#7e1d91]/80 mb-2">Ajustes del perfil</p>
          <h2 className="text-2xl font-bold text-[#3b0f52]">Editar perfil</h2>
        </div>

        <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-[#4f2f7a] mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e9d8ff] px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4f2f7a] mb-1">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e9d8ff] px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7e1d91]/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#4f2f7a] mb-1">Correo</label>
            <input
              type="email"
              value={usuarioActual.correo}
              disabled
              className="w-full bg-[#fbf7ff] border border-[#e9d8ff] px-4 py-2.5 rounded-2xl cursor-not-allowed text-[#7e6ca8]"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#25d3c9] text-[#0f172a] py-3 rounded-2xl shadow-lg shadow-[#25d3c9]/20 hover:bg-[#1fbfb3] transition-colors disabled:bg-gray-300"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
