import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// 1. IMPORTACIONES DE CONTEXTO
import { MascotProvider } from "./context/MascotContext";

// 2. IMPORTACIÓN DE COMPONENTES DE DISEÑO
import YapeMascot from "./componentes/YapeMascot/YapeMascot";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

// --- COMPONENTE DE CONTROL DE SCROLL ---
import ScrollToTop from "./componentes/ScrollToTop"; 

// PÁGINAS CON LAZY LOADING (Carga bajo demanda)
const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const CentrodeAyuda = lazy(() => import("./paginas/CentrodeAyuda"));
const Unete = lazy(() => import("./paginas/Unete"));
const Perfil = lazy(() => import("./paginas/Perfil"));
const LibroDeReclamaciones = lazy(() => import("./paginas/LibroDeReclamaciones"));
const VerDetalles = lazy(() => import("./componentes/VerDetalles"));
const FormularioDePostulacion = lazy(() => import("./paginas/FormularioDePostulacion"));

function App() {
  return (
    <MascotProvider>
      {/* ScrollToTop asegura que al cambiar de página 
          el navegador vuelva automáticamente arriba.
      */}
      <ScrollToTop />

      <Suspense
        fallback={
          <div style={{ 
            textAlign: "center", 
            marginTop: "10rem", 
            fontFamily: "sans-serif", 
            fontWeight: "900", 
            color: "#7e1d91",
            fontStyle: "italic" 
          }}>
            Yo yapeo, tú yapeas, todos yapeamos ...
          </div>
        }
      >
        <Routes>
          {/* MainLayout envuelve a todas las rutas que llevan NavBar y Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/centrodeayuda" element={<CentrodeAyuda />} />
            <Route path="/unete" element={<Unete />} />
            <Route path="/perfil/:username" element={<Perfil />} />
            <Route path="/libro-de-reclamaciones" element={<LibroDeReclamaciones />} />
            
            {/* Rutas dinámicas para empleos */}
            <Route path="/detalles-empleo/:id" element={<VerDetalles />} />
            <Route path="/postular/:id" element={<FormularioDePostulacion />} />

            {/* RUTA DE CAPTURA (404): 
                Si el usuario entra a una ruta que no existe o recarga en GitHub Pages,
                lo redirige automáticamente al Inicio para evitar el error de consola.
            */}
            <Route path="*" element={<Inicio />} />
          </Route>
        </Routes>

        <YapeMascot />
      </Suspense>
    </MascotProvider>
  );
}

export default App;