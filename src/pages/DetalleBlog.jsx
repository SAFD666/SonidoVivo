import { Link, useParams } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import { entradasBlog } from '../data/blog';

function DetalleBlog() {
  const { id } = useParams();
  const entrada = entradasBlog.find((e) => e.id === id);

  if (!entrada) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>Entrada no encontrada</h2>
          <p>La publicación que buscas no existe o fue eliminada.</p>
          <Link to="/blog" className="enlace-texto">Volver al blog</Link>
        </section>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <section className="contenedor-principal text-start">
        <div className="row">
          <article className="col-12 col-lg-8 mx-auto">
            <header className="mb-3">
              <h2 className="titulo-seccion text-start">{entrada.titulo}</h2>
              <p className="small">
                <time dateTime={entrada.fecha}>{entrada.fecha}</time> · {entrada.autor}
              </p>
            </header>

            <figure className="card p-4 mb-4">
              <img src={entrada.imagen} alt={entrada.titulo} className="img-fluid mx-auto d-block" />
            </figure>

            {entrada.contenido.map((parrafo, indice) => (
              <p key={indice}>{parrafo}</p>
            ))}

            <footer className="mt-4">
              <Link to="/blog" className="enlace-texto">← Volver al blog</Link>
            </footer>
          </article>
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default DetalleBlog;