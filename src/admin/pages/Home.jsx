import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function Home() {
  const [loading, setLoading] = useState(true);
  const [watches, setWatches] = useState([]);
  const nav = useNavigate();
  const API_WATCHES = `http://127.0.0.1:8000/api/control/watches`;
  useEffect(() => {
    fetch(`${API_WATCHES}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
      .then((a) => a.json())
      .then((a) => {
        setWatches(a);
        setLoading(false);
      });
  }, []);
  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        fetch(`${API_WATCHES}/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
          // body: formData,
        })
          .then((a) => {
            setLoading(false);
            if (a.status === 201) {
              Swal.fire({
                icon: "success",
                title: "Product Deleted",
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                window.location.reload();
                nav("/control/watches");
              });
            }
            return a.json();
          })
          .then((a) => {
            if (a.errors) {
              const errorsAsString = Object.values(a.errors)
                .map((a) => `<p class="error__text">${a[0]}</p>`)
                .toString()
                .replace(/,/g, "");
              Swal.fire({
                icon: "error",
                title: "Oops...",
                html: errorsAsString,
              });
            }
            if (a.message === "Unauthenticated.") {
              window.localStorage.removeItem("token");
              nav("/control/login");
            }
          });
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    });
  };
  return (
    <>
      <h4>
        Watches
        <Link to="add" className="btn btn-success ms-2">
          Add New Watch
        </Link>
      </h4>
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-5">
        {loading ? (
          <div className="spinner-border text-primary" role="status"></div>
        ) : watches.length ? (
          watches.map((a) => (
            <div className="col" key={a.id}>
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src={a.images[0]?.image}
                  alt="Card image cap"
                  style={{ height: "300px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{a.title}</h5>
                  <p style={{ height: 100 }} className="card-text"></p>
                  <Link to={`edit/${a.id}`} className="btn btn-warning ">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(a.id)}
                    to="#"
                    className="btn btn-danger ms-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>Watches Not Found...</h1>
        )}
      </div>
    </>
  );
}

export default Home;
