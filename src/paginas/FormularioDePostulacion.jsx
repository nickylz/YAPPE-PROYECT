import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FormularioDePostulacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Estados actualizados con Email y Celular
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(""); // Nuevo
  const [celular, setCelular] = useState(""); // Nuevo
  const [linkCV, setLinkCV] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !celular || !linkCV) {
      return alert("Por favor, completa todos los campos para postular");
    }

    setCargando(true);
    try {
      // Guardamos TODO en Firestore
      await addDoc(collection(db, "postulaciones"), {
        nombrePostulante: nombre,
        correo: email,
        telefono: celular,
        vacanteId: id || "general",
        cvUrl: linkCV,
        fecha: new Date().toLocaleString(), // Guardamos fecha y hora
      });

      setEnviado(true);
      setTimeout(() => navigate("/productos"), 3000);
    } catch (error) {
      console.error("Error:", error);
      alert("Ups, Hubo un fallo al enviar, revisa tu conexión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-[#fff3f0] min-h-screen pt-28 pb-20 p-4 flex justify-center font-sans">
      <div className="bg-white border-2 border-[#b8ffde] rounded-[2.5rem] p-10 shadow-lg max-w-xl w-full">
        {enviado ? (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-[#7422ff] italic uppercase">
              ¡Postulación Enviada!
            </h2>
            <p className="text-gray-600 font-bold text-lg">
              Gracias {nombre}, nos pondremos en contacto pronto.
            </p>
            <div className="text-6xl animate-bounce">💜</div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black text-[#7422ff] mb-8 italic uppercase tracking-tighter">
              Trabaja con nosotros
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NOMBRE */}
              <div>
                <label className="block text-[#7422ff] font-bold mb-1 ml-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#7422ff] outline-none"
                  placeholder="Coloque su nombre completo aquí"
                />
              </div>

              {/* GMAIL */}
              <div>
                <label className="block text-[#7422ff] font-bold mb-1 ml-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#7422ff] outline-none"
                  placeholder="name@gmail.com"
                />
              </div>

              {/*  CELULAR */}
              <div>
                <label className="block text-[#7422ff] font-bold mb-1 ml-2">
                  Número de celular
                </label>
                <input
                  type="tel"
                  required
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#7422ff] outline-none"
                  placeholder="+51 912345678"
                />
              </div>

              {/* LINK CV */}
              <div>
                <label className="block text-[#7422ff] font-bold mb-1 ml-2">
                  Enlace de tu CV (Drive)
                </label>
                <input
                  type="url"
                  required
                  value={linkCV}
                  onChange={(e) => setLinkCV(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#7422ff] outline-none"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#7422ff] text-white text-xl font-black py-5 rounded-full shadow-lg hover:bg-[#5a18cc] transition-all disabled:opacity-50 uppercase italic"
              >
                {cargando ? "ENVIANDO..." : "ENVIAR MI POSTULACIÓN"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
