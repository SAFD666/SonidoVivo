import Boton from "../atoms/Boton";

function FiltroCategoria(props) {
  return (
    <aside className="filtros-aside">
      <h2>Filtros</h2>
      <form onSubmit={(e) => { e.preventDefault(); props.onAplicar(); }}>
        <fieldset className="filtro-fieldset">
          <legend>Marca</legend>
          {props.marcasDisponibles.map((marca) => (
            <div key={marca} className="opcion-filtro">
              <input
                type="checkbox"
                id={`marca-${marca}`}
                value={marca}
                checked={props.marcasSeleccionadas.includes(marca)}
                onChange={() => props.onCambiarMarca(marca)}
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