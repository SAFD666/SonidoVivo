
import { useState } from 'react';

function ContadorCantidad({ cantidad: cantidadProp, maximo = 99, onChange }) {
  const [cantidadInterna, setCantidadInterna] = useState(1);

  const esControlado = cantidadProp !== undefined;
  const cantidadActual = esControlado ? cantidadProp : cantidadInterna;

  const actualizar = (nuevoValor) => {
    if (esControlado && onChange) {
      onChange(nuevoValor);
    } else {
      setCantidadInterna(nuevoValor);
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