import { useNavigate } from 'react-router-dom';
import Boton from "../components/atoms/Boton";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import { useTienda } from '../context/TiendaContext';
import { generarSlug } from '../data/productos';

function Inicio() {
  const navigate = useNavigate();
  const { categorias } = useTienda();

  return (
    <PlantillaPublica>
      <section className="bienvenida">
        <div className="hero-contenido">
          <h2>Instrumentos Musicales y Equipos de Sonido</h2>
          <p>Atención a clientes de Viña del Mar y envíos a todo Chile</p>

          <Boton
            texto="Ver Catálogo Completo"
            className="btn-sonido-vivo btn-hero"
            onClick={() => navigate("/catalogo")}
          />
        </div>
      </section>

      <section className="contenedor-principal">
        <h2 className="titulo-seccion">Nuestras Categorías</h2>

        <div className="grilla-categoria">
          {categorias.map((categoria) => (
            <article
              key={categoria.nombre}
              className="tarjeta-producto"
              onClick={() => navigate(`/categoria/${generarSlug(categoria.nombre)}`)}
            >
              <figure>
                <img src={categoria.imagen} alt={categoria.nombre} />
              </figure>
              <h3>{categoria.nombre}</h3>
            </article>
          ))}
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default Inicio;