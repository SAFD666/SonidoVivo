import { useState } from "react";
import CampoTexto from "../atoms/CampoTexto";
import Boton from "../atoms/Boton";

function BarraBusqueda({ valorInicial = "", onBuscar }) {
  const [texto, setTexto] = useState(valorInicial);

  const enviar = (e) => {
    e.preventDefault();
    onBuscar(texto.trim());
  };

  return (
    <form className="barra-busqueda" onSubmit={enviar} role="search">
      <label htmlFor="busqueda-global" className="visually-hidden">Buscar productos</label>
      <CampoTexto
        id="busqueda-global"
        name="busqueda"
        type="search"
        placeholder="Buscar guitarras, marcas, pedales..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <Boton texto="Buscar" type="submit" className="btn-sonido-vivo" />
    </form>
  );
}

export default BarraBusqueda;