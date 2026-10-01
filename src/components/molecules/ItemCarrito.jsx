import Precio from "../atoms/Precio";
import ContadorCantidad from "../atoms/ContadorCantidad";

function ItemCarrito(props) {
  return (

    <div className="card p-3 mb-3">

      <h5>{props.nombre}</h5>

      <Precio precio={props.precio} />

      <ContadorCantidad />

    </div>
    
  );
}

export default ItemCarrito;