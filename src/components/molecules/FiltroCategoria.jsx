import CampoTexto from "../atoms/CampoTexto";

function CampoFormulario(props) {
  return (
    <div className="mb-3">

      <label className="form-label">
        {props.label}
      </label>

      <CampoTexto
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />

    </div>
  );
}

export default CampoFormulario;