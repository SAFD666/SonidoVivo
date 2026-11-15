function CampoTexto(props) {
  return (
    <input
      id={props.id}
      name={props.name}
      type={props.type || "text"}
      className="form-control"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      required={props.required}
      min={props.min}
      step={props.step}
    />
  );
}

export default CampoTexto;