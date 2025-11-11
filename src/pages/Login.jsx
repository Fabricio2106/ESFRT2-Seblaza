import { FcGoogle } from "react-icons/fc";
import { BsShieldExclamation } from "react-icons/bs";

export default function Login() {
  return (
    <section className="mx-auto" style={{ maxWidth: "960px", padding: "2rem" }}>
      <div className="row mt-4">
        <div className="col-12 col-md-6 d-flex align-items-start flex-column">
          <h1 style={{ fontSize: "32px", fontWeight: "600" }}>
            Ingresa tu e-mail o teléfono para iniciar sesión
          </h1>
          <button className="btn btn-custom4 mt-auto d-flex align-items-center justify-content-between border rounded px-3 py-1 gap-2">
            <span
              className="d-flex align-items-center gap-2"
              style={{ fontSize: "13px" }}
            >
              <BsShieldExclamation size={20} />
              .............
            </span>
            <span style={{ fontWeight: "bold", fontSize: "30px" }}>›</span>
          </button>
        </div>
        <div className="col-12 col-md-6 ">
          <form
            className="d-flex flex-column justify-content-center"
            style={{
              padding: "2rem",
              rowGap: "10px",
              border: "1px solid rgba(0,0,0,.1)",
            }}
          >
            <div className="mb-4">
              <label for="exampleInputEmail1" className="form-label">
                Email o teléfono
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <button type="submit" className="btn btn-custom">
              Continuar
            </button>
            <button type="submit" className="btn btn-custom2">
              Crear cuenta
            </button>
            <button
              type="submit"
              className="btn btn-custom3  d-flex align-items-center position-relative mt-5"
              style={{ justifyContent: "center" }}
            >
              <span className="position-absolute start-0 ms-3">
                <FcGoogle size={22} />
              </span>
              <span>Iniciar sesión con Google</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
