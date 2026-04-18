import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// 1. IMPORTACIONES DE CONTEXTO
import { MascotProvider } from "./context/MascotContext";
import { useAuth } from "./context/authContext";

// 2. IMPORTACIÓN DE COMPONENTES DE DISEÑO
import YapeMascot from "./componentes/YapeMascot/YapeMascot";
import MainLayout from "./layouts/MainLayout";
import "./App.css";
import Login from './componentes/Login';

// PÁGINAS CON LAZY LOADING
const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const CentrodeAyuda = lazy(() => import("./paginas/CentrodeAyuda"));
const Unete = lazy(() => import("./paginas/Unete")); // Cambiado de Productos a Unete
const Perfil = lazy(() => import("./paginas/Perfil"));
const LibroDeReclamaciones = lazy(() => import("./paginas/LibroDeReclamaciones"));

// 3. IMPORTACIÓN DE VER DETALLES (Ruta ajustada a componentes)
const VerDetalles = lazy(() => import("./componentes/VerDetalles"));
const FormularioDePostulacion = lazy(() => import("./paginas/FormularioDePostulacion"));

function App() {
  return (
    <MascotProvider>
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
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/centrodeayuda" element={<CentrodeAyuda />} />
            <Route path="/unete" element={<Unete />} /> {/* Ahora llama al componente Unete */}
            <Route path="/perfil/:username" element={<Perfil />} />
            <Route path="/libro-de-reclamaciones" element={<LibroDeReclamaciones />} />
            

            {/* RUTA VINCULADA */}
            <Route path="/detalles-empleo/:id" element={<VerDetalles />} />
            <Route path="/postular/:id" element={<FormularioDePostulacion />} />
          </Route>
        </Routes>

        <YapeMascot />
      </Suspense>
    </MascotProvider>
  );
}

export default App;