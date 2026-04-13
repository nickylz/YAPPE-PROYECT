import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FormularioDePostulacion() {
  const { id } = useParams(); // Por si quieres saber a qué puesto postula
  const navigate = useNavigate();
  const [enviado, setEnviado] = useState(false);
  const [archivo, setArchivo] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setArchivo(e.target.files[0].name);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar en Firebase Storage y Firestore
    setEnviado(true);
    setTimeout(() => navigate("/productos"), 3000);
  };

  return (
    <div className="bg-[#fbf0ff]  min-h-screen pt-28 pb-20 p-4 flex justify-center font-sans">
      <div className="bg-white border-2  border-[#b8ffde] rounded-[2.5rem] p-10 shadow-lg max-w-xl w-full">
        <h2 className="text-3xl font-black text-[#7422ff] mb-8 uppercase tracking-tighter">
          Trabaja con nosotros
        </h2>

        {enviado ? (
          <div className="text-center py-10">
            <h3 className="text-[#00d1ce] font-bold text-xl mb-2">
              ¡Recibimos tu CV!
            </h3>
            <p className="text-gray-500">
              Te redirigiremos en unos segundos...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#7422ff] font-bold mb-1 ml-2">
                Nombre completo
              </label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-2xl border-2 border-gray-100 focus:border-[#7422ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#7422ff] font-bold mb-1 ml-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                className="w-full p-3 rounded-2xl border-2 border-gray-100 focus:border-[#7422ff] outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#7422ff] font-bold mb-2 ml-2">
                Adjunta tu CV (PDF)
              </label>

              {/* El cuadro punteado estilo Yape */}
              <div className="relative border-2 border-dashed border-[#d1b9ff] bg-[#f8f5ff] rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:bg-[#f0eaff] transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange} // <--- AGREGA ESTO
                />

                {/* Icono de imagen/archivo */}
                <div className="bg-[#e9e2ff] p-4 rounded-full mb-4">
                  <span className="text-4xl text-[#7422ff]">📄</span>
                </div>

                <h4 className="text-[#7422ff] font-black text-lg italic uppercase tracking-tighter">
                  {archivo ? "¡Archivo cargado!" : "Haz clic o arrastra tu CV"}
                </h4>

                <p className="text-[#7422ff] opacity-60 text-xs font-bold mt-1">
                  {archivo ? archivo : "Formatos permitidos: PDF (Máx. 10MB)"}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-[#00d1ce] text-white text-xl font-black py-4 rounded-2xl shadow-md hover:bg-[#01b1af] transition-all uppercase "
            >
              Enviar Postulación
            </button>
            <button
              type="button"
              onClick={() => navigate("/productos")}
              className="w-full bg-[#f8f5ff] text-[#7422ff] text-lg font-black py-4 rounded-full uppercase italic tracking-tighter hover:bg-[#eee5ff] transition-all"
            >
              VOLVER
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
