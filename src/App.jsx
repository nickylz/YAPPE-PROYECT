import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// 1. IMPORTACIONES DE CONTEXTO (Faltaba MascotProvider)
import { MascotProvider } from "./context/MascotContext"; 
import { useAuth } from "./context/authContext";

// 2. IMPORTACIÓN DEL COMPONENTE (Ruta corregida)
import YapeMascot from "./componentes/YapeMascot/YapeMascot";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

// PÁGINAS CON LAZY LOADING
const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const Productos = lazy(() => import("./paginas/Productos"));
const Perfil = lazy(() => import("./paginas/Perfil"));
const Intranet = lazy(() => import("./paginas/Intranet"));
const LibroDeReclamaciones = lazy(() => import("./paginas/LibroDeReclamaciones"));

function App() {
  return (
    /* MascotProvider debe envolver TODO */
    <MascotProvider> 
      <Suspense
        fallback={
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            Cargando dulzura ...
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/perfil/:username" element={<Perfil />} />
            <Route path="/intranet" element={<Intranet />} />
            <Route path="/libro-de-reclamaciones" element={<LibroDeReclamaciones />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Renderizamos la mascota aquí para que sea global */}
      <YapeMascot /> 
    </MascotProvider>
  );
}

export default App;