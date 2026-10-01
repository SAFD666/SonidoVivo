import Boton from "../atoms/Boton";
import EtiquetaStock from "../atoms/EtiquetaStock";
import Precio from "../atoms/Precio";

function TarjetaProducto(props) {
  return (
    <div className="card h-100 p-3">

      <h5>{props.nombre}</h5>

      <p>
        {props.marca} {props.modelo}
      </p>

      <Precio precio={props.precio} />

      <EtiquetaStock stock={props.stock} />

      <br />

      <Boton
        texto="Ver producto"
        variante="primary"
        onClick={props.onVer}
      />

    </div>
  );
}

export default TarjetaProducto;