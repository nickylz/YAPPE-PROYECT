import incono from "../componentes/img/Bom.png";

export default function Productos() {
  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      {/* --- Header -- */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Haz tu pedido ideal</h1>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            En <span className="font-semibold text-[#f5bfb2]">BomBocado</span> cada postre está hecho con dedicación, frescura y amor.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center py-10">
          <img src={incono} alt="Torta decorada" className="w-4/5 md:w-[53%] h-auto object-contain" />
        </div>
      </section>
    </div>
  );
}