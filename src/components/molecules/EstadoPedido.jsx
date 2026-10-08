function EstadoPedido(props) {
    return (
        <span className="badge bg-primary">
            {props.estado}
        </span>
    )
}

export default EstadoPedido;