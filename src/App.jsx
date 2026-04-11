import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout
import MainLayout from "./layouts/MainLayout";

// Contexto y Mascota
import { MascotProvider } from "./context/MascotContext";
import CakeMascot from "./componentes/CakeMascot";

import "./App.css";

//  PÁGINAS CON LAZY LOADING
const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const Productos = lazy(() => import("./paginas/Productos"));
const Perfil = lazy(() => import("./paginas/Perfil"));
const Intranet = lazy(() => import("./paginas/Intranet"));
const LibroDeReclamaciones = lazy(() =>
  import("./paginas/LibroDeReclamaciones")
);

function App() {
  return (
    <MascotProvider>
      {/* Siempre visibles */}
      <CakeMascot />

      {/* 👇 Suspense envuelve las rutas */}
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
            <Route
              path="/libro-de-reclamaciones"
              element={<LibroDeReclamaciones />}
            />
          </Route>
        </Routes>
      </Suspense>
    </MascotProvider>
  );
}

export default App;
