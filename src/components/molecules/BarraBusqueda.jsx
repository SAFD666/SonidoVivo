import { useState } from "react";
import CampoTexto from "../atoms/CampoTexto";
import Boton from "../atoms/Boton";

function BarraBusqueda(props) {
  //  el texto que la persona va escribiendo
  const [texto, setTexto] = useState(props.valorInicial || "");

  const enviar = (e) => {
    e.preventDefault();
    props.onBuscar(texto.trim()); // avisa al padre qué se buscó
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