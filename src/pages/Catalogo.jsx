import React, { useState } from 'react';
import PlantillaPublica from "../components/templates/PlantillaPublica";
import CatalogoProductos from "../components/organisms/CatalogoProductos";
import FiltroCategoria from "../components/molecules/FiltroCategoria";

const PRODUCTOS_INICIALES = [
  {
    codigo: "GE001",
    nombre: "Guitarra Eléctrica Squier Stratocaster® Affinity",
    marca: "Squier",
    modelo: "Affinity Series™",
    stock: 8,
    precio: 399990,
    imagen: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&q=80"
  },
  {
    codigo: "GE002",
    nombre: "Guitarra Eléctrica Yamaha RGX121Z",
    marca: "Yamaha",
    modelo: "RGX121Z",
    stock: 10,
    precio: 349990,
    imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&q=80"
  },
  {
    codigo: "GA001",
    nombre: "Guitarra Acústica Folk Yamaha F310",
    marca: "Yamaha",
    modelo: "F310",
    stock: 8,
    precio: 129990,
    imagen: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80"
  },
  {
    codigo: "GA002",
    nombre: "Guitarra Acústica Fender CD-60S Dreadnought",
    marca: "Fender",
    modelo: "CD-60S",
    stock: 5,
    precio: 189990,
    imagen: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&q=80"
  }
];

const MARCAS_FILTRO = ["Yamaha", "Fender", "Squier", "Takamine", "Epiphone"];

function Catalogo() {
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState(PRODUCTOS_INICIALES);

  const toggleMarca = (marca) => {
    if (marcasSeleccionadas.includes(marca)) {
      setMarcasSeleccionadas(marcasSeleccionadas.filter((m) => m !== marca));
    } else {
      setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
    }
  };

  const aplicarFiltros = () => {
    if (marcasSeleccionadas.length === 0) {
      setProductosVisibles(PRODUCTOS_INICIALES);
    } else {
      setProductosVisibles(
        PRODUCTOS_INICIALES.filter((p) => marcasSeleccionadas.includes(p.marca))
      );
    }
  };

  const handleVerDetalle = (producto) => {
    alert(`Detalle: ${producto.nombre} - Precio: $${producto.precio.toLocaleString('es-CL')}`);
  };

  return (
    <PlantillaPublica>
      <div className="contenedor-principal">
        <div className="catalogo-layout">
        
          <FiltroCategoria
            marcasDisponibles={MARCAS_FILTRO}
            marcasSeleccionadas={marcasSeleccionadas}
            onCambiarMarca={toggleMarca}
            onAplicar={aplicarFiltros}
          />

          
          <section>
            <h2 className="titulo-seccion">
              Instrumentos y Equipos
            </h2>
            <p className="subtitulo-catalogo">
              Mostrando {productosVisibles.length} productos disponibles
            </p>
            <CatalogoProductos 
              productos={productosVisibles} 
              onVer={handleVerDetalle} 
            />
          </section>
        </div>
      </div>
    </PlantillaPublica>
  );
}

export default Catalogo;