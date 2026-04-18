import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Configuración de NProgress
nprogress.configure({ showSpinner: false, speed: 400 });

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // 1. Inicia la barra de carga
    nprogress.start();

    // 2. FUERZA el scroll al inicio (0,0) de forma instantánea
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // 3. Por seguridad, resetea el scroll del elemento raíz y body
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // 4. Termina la animación
    const timer = setTimeout(() => {
      nprogress.done();
    }, 200);

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [pathname]);

  return null;
}