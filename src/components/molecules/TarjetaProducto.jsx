import Boton from "../atoms/Boton";
import EtiquetaStock from "../atoms/EtiquetaStock";
import Precio from "../atoms/Precio";
import BotonFavorito from "../atoms/BotonFavorito";

function TarjetaProducto(props) {
  return (
    <article className="tarjeta-producto">
      <figure className="tarjeta-imagen-contenedor">
        {props.esOferta && <span className="etiqueta-oferta">¡Oferta!</span>}
        <img
          src={props.imagen || "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&q=80"}
          alt={props.nombre}
          loading="lazy"
        />
      </figure>

      <div>
        <span className="codigo-item">Cód: {props.codigo}</span>
        <h3>{props.nombre}</h3>
        <p><strong>Marca:</strong> {props.marca} | <strong>Modelo:</strong> {props.modelo}</p>
        <div>
          <EtiquetaStock stock={props.stock} />
        </div>
        <Precio precio={props.precio} />
      </div>

      <div className="tarjeta-pie">
        <BotonFavorito nombreProducto={props.nombre} />
        <Boton
          texto="Ver detalle"
          className="btn-comprar"
          onClick={props.onVer}
        />
      </div>
    </article>
  );
}

export default TarjetaProducto;