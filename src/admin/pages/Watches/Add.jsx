import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";
function Add() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const [companies, setCompanies] = useState([]);
  const [category, setCategories] = useState([]);
  const [movement, setMovements] = useState([]);
  const [functionality, setFunctionalities] = useState([]);
  const API_WATCHES = `http://127.0.0.1:8000/api/control/watches`;
  const API_MOVEMENT = `http://127.0.0.1:8000/api/control/movements`;
  const API_COMPANY = `http://127.0.0.1:8000/api/control/companies`;
  const API_CATEGORY = `http://127.0.0.1:8000/api/control/categories`;
  const API_FUNCTIONALITY = `http://127.0.0.1:8000/api/control/functionalities`;
  useEffect(() => {
    fetch(`${API_COMPANY}`, {
      method: "GET",
      headers: {
        Accept: "Application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((a) => a.json())
      .then((a) => setCompanies(a))
      .then(() => {
        fetch(`${API_CATEGORY}`, {
          method: "GET",
          headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((a) => setCategories(a));
      })
      .then(() => {
        fetch(`${API_MOVEMENT}`, {
          method: "GET",
          headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((a) => setMovements(a));
      })
      .then(() => {
        fetch(`${API_FUNCTIONALITY}`, {
          method: "GET",
          headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((a) => setFunctionalities(a));
      });
  }, []);
  const [watch, setWatch] = useState({
    company_id: 0,
    category_id: 0,
    functionality_id: 0,
    movement_id: 0,
    title: "",
    model: "",
    case_material: "",
    dial_material: "",
    diameter: "",
    shape: "",
    price: "",
    discount: "",
    color: "",
    dial: "",
    description: "",
    quality: "",
    featured: "",
    delivery:
      "Watches.com Standard International Mail* (249$-dan yuxarı sifarişlər) və Standard Domestic Mail (100$+-dan yuxarı sifarişlər) xərclərini ödəyəcək.",
    rate: 0,
    images: [],
  });
  const handleInput = (e) => {
    setWatch({ ...watch, [e.target.name]: e.target.value });
  };
  const handleFile = (e) => {
    setWatch({ ...watch, [e.target.name]: e.target.files });
  };
  const save = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    for (const key in watch) {
      if (Array.isArray(watch[key]) || key === "images") {
        [...watch[key]].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
        continue;
      }
      formData.append(key, watch[key]);
    }
    fetch(`${API_WATCHES}`, {
      method: "POST",
      headers: {
        Accept: "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((a) => {
        console.log(a);
        setLoading(false);
        if (a.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Yaradıldı",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
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
  };
  return (
    <>
      <h4 className="fw-bold py-3 mb-4">Adding New Watch </h4>
      {loading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <div className="row">
          <div className="col-xl">
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={save}>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Name
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.title}
                        name="title"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Title"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Model
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.model}
                        name="model"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Model"
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-md-12">
                    <label
                      className="form-label"
                      htmlFor="basic-default-fullname"
                    >
                      Images
                      <span className="required">*</span>
                    </label>
                    <input
                      onChange={handleFile}
                      name="images"
                      type="file"
                      className="form-control"
                      id="basic-default-fullname"
                      placeholder=""
                      multiple={true}
                    />
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Company
                      </label>
                      <select
                        onChange={handleInput}
                        name="company_id"
                        className="form-control"
                        // value={watch.company_id}
                      >
                        <option value="">Choose Company</option>
                        {companies.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Category
                      </label>
                      <select
                        onChange={handleInput}
                        name="category_id"
                        className="form-control"
                        // value={watch.category_id}
                      >
                        <option value="">Choose Category</option>
                        {category.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Movements
                      </label>
                      <select
                        onChange={handleInput}
                        name="movement_id"
                        className="form-control"
                        // value={watch.movement_id}
                      >
                        <option value="">Choose Movement</option>
                        {movement.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Functionality
                      </label>
                      <select
                        onChange={handleInput}
                        name="functionality_id"
                        className="form-control"
                        // value={watch.functionality_id}
                      >
                        <option value="">Choose Functionality</option>
                        {functionality.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Dial Material
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.dial_material}
                        name="dial_material"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Dial Material"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Diameter
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.diameter}
                        name="diameter"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Diameter"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Shape
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.shape}
                        name="shape"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Shape"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Price
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.price}
                        name="price"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Color
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.color}
                        name="color"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Color"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Dial
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.dial}
                        name="dial"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Dial"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Description
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.description}
                        name="description"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Description"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Quality
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.quality}
                        name="quality"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Quality"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Featured
                      </label>
                      <select
                        onChange={handleInput}
                        name="featured"
                        className="form-control"
                        value={watch.featured}
                      >
                        <option value="">Is Product Featured?</option>
                        <option value="1">Featured</option>
                        <option value="0">Not Featured</option>
                      </select>
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Rate
                      </label>
                      <select
                        onChange={handleInput}
                        name="rate"
                        className="form-control"
                        value={watch.rate}
                      >
                        <option value="">Rate Product</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Case Material
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.case_material}
                        name="case_material"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Case Material"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="basic-default-fullname"
                      >
                        Discount
                      </label>
                      <input
                        onChange={handleInput}
                        value={watch.discount}
                        name="discount"
                        type="text"
                        className="form-control"
                        id="basic-default-fullname"
                        placeholder="Discount"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success d-block ms-auto"
                  >
                    Add Watch
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// const t = (a) => a;
export default connect()(Add);
