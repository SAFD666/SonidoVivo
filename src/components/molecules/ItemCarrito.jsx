import Precio from "../atoms/Precio";
import ContadorCantidad from "../atoms/ContadorCantidad";
import Boton from "../atoms/Boton";

function ItemCarrito(props) {
  return (
    <div className="item-carrito">
      <img src={props.imagen} alt={props.nombre} className="item-carrito-imagen" />

      <div className="item-carrito-datos">
        <span className="codigo-item">Cód: {props.codigo}</span>
        <h5>{props.nombre}</h5>
        <Precio precio={props.precio} />
      </div>

      <ContadorCantidad
        cantidad={props.cantidad}
        maximo={props.stock}
        onChange={props.onCambiarCantidad}
      />

      <div className="item-carrito-subtotal">
        <small>Subtotal</small>
        <Precio precio={props.precio * props.cantidad} />
      </div>

      <Boton texto="Eliminar" className="btn btn-outline-danger btn-sm" onClick={props.onEliminar} />
    </div>
  );
}

export default ItemCarrito;