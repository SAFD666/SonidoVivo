import { useState } from 'react';

function ContadorCantidad() {
  const [cantidad, setCantidad] = useState(1);

  function aumentar() {
    setCantidad(cantidad + 1);
  }

  function disminuir() {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  }

  return (
    <div className="contador-cantidad">
      <button
        className="btn btn-secondary"
        onClick={disminuir}
      >
        -
      </button>

      <span>{cantidad}</span>

      <button
        className="btn btn-secondary"
        onClick={aumentar}
      >
        +
      </button>
    </div>
  );
}

export default ContadorCantidad;