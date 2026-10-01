function CampoTexto(props) {
  return (
    <input

      type="text"
      className="form-control"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      
    />
  );
}

export default CampoTexto;