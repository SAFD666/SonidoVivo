import CampoTexto from "../atoms/CampoTexto";

function CampoFormulario(props) {
  return (
    <div className="mb-3 campo-formulario">
      <label className="form-label" htmlFor={props.id}>
        {props.label}
      </label>

      <CampoTexto
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        min={props.min}
        step={props.step}
      />

      {props.error && <small className="texto-error">{props.error}</small>}
    </div>
  );
}

export default CampoFormulario;