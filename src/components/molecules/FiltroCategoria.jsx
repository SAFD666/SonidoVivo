import Boton from "../atoms/Boton";

function FiltroCategoria({ marcasDisponibles, marcasSeleccionadas, onCambiarMarca, onAplicar }) {
  return (
    <aside className="filtros-aside">
      <h2>Filtros</h2>
      <form onSubmit={(e) => { e.preventDefault(); onAplicar(); }}>
        <fieldset className="filtro-fieldset">
          <legend>Marca</legend>
          {marcasDisponibles.map((marca) => (
            <div key={marca} className="opcion-filtro">
              <input
                type="checkbox"
                id={`marca-${marca}`}
                value={marca}
                checked={marcasSeleccionadas.includes(marca)}
                onChange={() => onCambiarMarca(marca)}
              />
              <label htmlFor={`marca-${marca}`}>{marca}</label>
            </div>
          ))}
        </fieldset>

        <Boton 
          texto="Aplicar Filtros" 
          type="submit" 
          className="btn-sonido-vivo btn-ancho-total" 
        />
      </form>
    </aside>
  );
}

export default FiltroCategoria;