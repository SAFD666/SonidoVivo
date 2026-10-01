function Selector(props) {
  return (
    <select

      className="form-select"
      value={props.value}
      onChange={props.onChange}

    >

      {props.opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
      
    </select>
  );
}

export default Selector;