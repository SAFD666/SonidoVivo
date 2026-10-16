function CampoTexto({ id, name, type = "text", placeholder, value, onChange, required = false, min, step }) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
    />
  );
}

export default CampoTexto;