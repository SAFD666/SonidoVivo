import { useState } from 'react';

function BotonFavorito(props) {
  // parte con el valor que manda el padre (props) o en false
  const [esFavorito, setEsFavorito] = useState(props.favoritoInicial ?? false);

  function alHacerClic() {
    setEsFavorito(!esFavorito);
  }

  return (
    <button
      type="button"
      className={esFavorito ? "boton-favorito activo" : "boton-favorito"}
      onClick={alHacerClic}
      aria-pressed={esFavorito}
      title={
        esFavorito
          ? `Quitar ${props.nombreProducto} de favoritos`
          : `Agregar ${props.nombreProducto} a favoritos`
      }
    >
      {esFavorito ? '★ En favoritos' : '☆ Agregar a favoritos'}
    </button>
  );
}

export default BotonFavorito;