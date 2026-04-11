import React from "react";

export default function ProductoCard({
  producto,
  mostrarBoton = true,
}) {

  const tieneDescuento =
    typeof producto.descuento === "number" && producto.descuento > 0;
  const precioFinal = tieneDescuento
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;

  const CardContent = () => (
    <>
      <div className="w-full aspect-square overflow-hidden rounded-t-2xl">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-lg text-[#7a1a0a] truncate">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-600 h-10 overflow-hidden">
          {producto.frase}
        </p>
        {typeof producto.precio === "number" ? (
          tieneDescuento ? (
            <div className="flex justify-center items-baseline gap-2 mt-1">
              <p className="text-[#d16170] font-bold text-xl">
                S/{precioFinal.toFixed(2)}
              </p>
              <p className="text-gray-400 line-through text-sm">
                S/{producto.precio.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-[#d16170] font-semibold text-xl mt-1">
              S/{producto.precio.toFixed(2)}
            </p>
          )
        ) : (
          <p className="w-full bg-[#d16170] text-white py-2 rounded-xl hover:bg-[#b84c68] transition-colors font-bold">
            Próximamente
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className="relative group bg-white border border-[#f5bfb2] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      {/* Etiqueta de Descuento */}
      {tieneDescuento && (
        <div
          className="absolute top-3 left-3 bg-green-500 text-white 
                  text-sm font-bold px-3 py-1.5 
                  rounded-full z-10"
        >
          -{producto.descuento}%
        </div>
      )}

      <div className="block grow">
        <CardContent />
      </div>

    </div>
  );
}
