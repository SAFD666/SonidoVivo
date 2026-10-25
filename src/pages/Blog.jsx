import { Link } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import { entradasBlog } from '../data/blog';

function Blog() {
  return (
    <PlantillaPublica>
      <section className="contenedor-principal text-start">
        <header className="mb-4">
          <h2 className="titulo-seccion">Blog Sonido Vivo</h2>
          <p className="subtitulo-catalogo text-start">Consejos, novedades y guías para músicos.</p>
        </header>

        <div className="row g-4">
          {entradasBlog.map((entrada) => (
            <article key={entrada.id} className="col-12 col-md-6">
              <div className="card h-100">
                <img src={entrada.imagen} alt={entrada.titulo} className="card-img-top p-4" />
                <div className="card-body d-flex flex-column">
                  <h3 className="h5">{entrada.titulo}</h3>
                  <p className="small mb-2">
                    <time dateTime={entrada.fecha}>{entrada.fecha}</time> · {entrada.autor}
                  </p>
                  <p className="flex-grow-1">{entrada.resumen}</p>
                  <Link to={`/blog/${entrada.id}`} className="enlace-texto">Leer más</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default Blog;