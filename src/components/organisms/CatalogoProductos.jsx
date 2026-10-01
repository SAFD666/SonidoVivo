import { Container, Row, Col } from "react-bootstrap";
import TarjetaProducto from "../molecules/TarjetaProducto";

function CatalogoProductos(props) {

  return (
    <Container>

      <Row>

        {props.productos.map((producto) => (
          <Col
            key={producto.codigo}
            xs={12}
            md={6}
            lg={4}
            className="mb-3"
          >

            <TarjetaProducto
              nombre={producto.nombre}
              marca={producto.marca}
              modelo={producto.modelo}
              precio={producto.precio}
              stock={producto.stock}
              onVer={() => props.onVer(producto)}
            />

          </Col>
        ))}

      </Row>

    </Container>
  );
}

export default CatalogoProductos;
