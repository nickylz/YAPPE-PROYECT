import React, { useState } from 'react';

const PreguntasApp = () => {
  const [categorias, setCategorias] = useState(['General', 'Programación']);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [datos, setDatos] = useState([]);
  
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('General');

  // Agregar nueva categoría
  const agregarCategoria = () => {
    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria('');
    }
  };

  // Agregar nueva pregunta
  const agregarPregunta = (e) => {
    e.preventDefault();
    const nuevoItem = {
      id: Date.now(),
      categoria: catSeleccionada,
      pregunta,
      respuesta
    };
    setDatos([...datos, nuevoItem]);
    setPregunta('');
    setRespuesta('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Panel de Preguntas</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario de Creación */}
        <div className="space-y-6">
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="font-semibold mb-3">Crear Categoría</h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                placeholder="Nombre de categoría..."
                className="border p-2 rounded w-full text-sm"
              />
              <button 
                onClick={agregarCategoria}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Añadir
              </button>
            </div>
          </section>

          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="font-semibold mb-3">Nueva Pregunta</h2>
            <form onSubmit={agregarPregunta} className="space-y-3">
              <select 
                value={catSeleccionada}
                onChange={(e) => setCatSeleccionada(e.target.value)}
                className="w-full border p-2 rounded text-sm"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Escribe la pregunta" 
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                required
              />
              <textarea 
                placeholder="Escribe la respuesta" 
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                className="w-full border p-2 rounded text-sm h-24"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
              >
                Guardar Pregunta
              </button>
            </form>
          </section>
        </div>

        {/* Visualización de Preguntas */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Listado por Categoría</h2>
          {categorias.map(cat => (
            <div key={cat} className="mb-6">
              <h3 className="text-blue-600 font-bold border-b pb-1 mb-3 uppercase text-xs tracking-wider">
                {cat}
              </h3>
              {datos.filter(item => item.categoria === cat).length > 0 ? (
                datos.filter(item => item.categoria === cat).map(item => (
                  <div key={item.id} className="bg-white p-3 rounded mb-2 border-l-4 border-blue-400 shadow-sm">
                    <p className="font-medium text-gray-900 leading-tight">{item.pregunta}</p>
                    <p className="text-gray-600 text-sm mt-2 italic">{item.respuesta}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs italic">No hay preguntas en esta categoría.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreguntasApp;