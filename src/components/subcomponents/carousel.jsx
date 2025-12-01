import slide1 from "../../assets/img/slide1.webp";
import slide2 from "../../assets/img/slide2.webp";
import slide3 from "../../assets/img/slide3.webp";

export default function Carousel() {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={slide1}
            className="d-block w-100"
            alt="Slide 1"
            style={{ height: "380px", objectFit: "cover" }}
          />
        </div>
        <div className="carousel-item">
          <img
            src={slide2}
            className="d-block w-100"
            alt="Slide 2"
            style={{ height: "380px", objectFit: "cover" }}
          />
        </div>
        <div className="carousel-item">
          <img
            src={slide3}
            className="d-block w-100"
            alt="Slide 3"
            style={{ height: "380px", objectFit: "cover" }}
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}


