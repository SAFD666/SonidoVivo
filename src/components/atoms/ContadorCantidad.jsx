import { useState } from 'react';

function ContadorCantidad(props) {
  // este prop viene del padre y no se modifican
  const maximo = props.maximo ?? 99;

  // estado: dato propio que cambia con los clics
  const [cantidadInterna, setCantidadInterna] = useState(1);

  // Si el padre enviara "cantidad", el contador es controlado por el padre
  const esControlado = props.cantidad !== undefined;
  const cantidadActual = esControlado ? props.cantidad : cantidadInterna;

  const actualizar = (nuevoValor) => {
    if (esControlado && props.onChange) {
      props.onChange(nuevoValor);   // avisa al padre
    } else {
      setCantidadInterna(nuevoValor); // cambia su propio estado
    }
  };

  function aumentar() {
    if (cantidadActual < maximo) {
      actualizar(cantidadActual + 1);
    }
  }

  function disminuir() {
    if (cantidadActual > 1) {
      actualizar(cantidadActual - 1);
    }
  }

  return (
    <div className="contador-cantidad">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={disminuir}
        disabled={cantidadActual <= 1}
      >
        -
      </button>

      <span>{cantidadActual}</span>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={aumentar}
        disabled={cantidadActual >= maximo}
      >
        +
      </button>
    </div>
  );
}

export default ContadorCantidad;