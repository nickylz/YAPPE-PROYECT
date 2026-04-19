import { Routes, Route, BrowserRouter } from "react-router-dom"; // Se agregó BrowserRouter aquí
import { lazy, Suspense } from "react";

import { MascotProvider } from "./context/MascotContext";

import MainLayout from "./layouts/MainLayout";
import YapeMascot from "./componentes/YapeMascot/YapeMascot";
import "./App.css";

// --- COMPONENTE DE CONTROL DE SCROLL ---
import ScrollToTop from "./componentes/ScrollToTop";

const Inicio = lazy(() => import("./paginas/Index"));
const Nosotros = lazy(() => import("./paginas/Nosotros"));
const CentrodeAyuda = lazy(() => import("./paginas/CentrodeAyuda"));
const Unete = lazy(() => import("./paginas/Unete"));
const Perfil = lazy(() => import("./paginas/Perfil"));
const LibroDeReclamaciones = lazy(
  () => import("./paginas/LibroDeReclamaciones"),
);
const VerDetalles = lazy(() => import("./componentes/VerDetalles"));
const FormularioDePostulacion = lazy(
  () => import("./paginas/FormularioDePostulacion"),
);

function App() {
  return (
    <MascotProvider>
      <BrowserRouter basename="/YAPPE-PROYECT">
        <ScrollToTop />

        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                marginTop: "10rem",
                fontFamily: "sans-serif",
                fontWeight: "900",
                color: "#7e1d91",
                fontStyle: "italic",
              }}
            >
              Yo yapeo, tú yapeas, todos yapeamos ...
            </div>
          }
        >
          <Suspense fallback={<h1>Cargando...</h1>}>
            <Routes>
              {/* MainLayout envuelve a todas las rutas que llevan NavBar y Footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/centrodeayuda" element={<CentrodeAyuda />} />
                <Route path="/unete" element={<Unete />} />
                <Route path="/perfil/:username" element={<Perfil />} />
                <Route
                  path="/libro-de-reclamaciones"
                  element={<LibroDeReclamaciones />}
                />

                <Route path="/detalles-empleo/:id" element={<VerDetalles />} />
                <Route
                  path="/postular/:id"
                  element={<FormularioDePostulacion />}
                />

                <Route path="*" element={<Inicio />} />
              </Route>
            </Routes>
            <YapeMascot />
          </Suspense>
        </Suspense>
      </BrowserRouter>
    </MascotProvider>
  );
}

export default App;
