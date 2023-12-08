import React, { useState, useEffect } from "react";
import styles from "./Products.module.css";

const ProductsList = () => {
  const [productlist, setProductlist] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(false);

  const [category, setCategory] = useState("");
  const [description, setdescription] = useState("");
  const [expireDate, setexpireDate] = useState("");
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setProductlist(
      JSON.parse(localStorage.getItem("productsPage"))["products"]
    );
  }, [selected]);

  const deleteHandler = (e) => {
    console.log(e.target.id);
    let obj = JSON.parse(localStorage.getItem("productsPage"));
    let productsData = obj["products"];

    let productsAfterDelete = productsData.filter(
      (item) => item.name !== e.target.id
    );
    obj = {
      ...obj,
      products: productsAfterDelete,
    };
    localStorage.setItem("productsPage", JSON.stringify(obj));

    setProductlist(
      JSON.parse(localStorage.getItem("productsPage"))["products"]
    );
  };

  const checkboxHandler = (e) => {
    if (e.target.checked) {
      setSelected([...selected, e.target.id]);
    } else {
      selected.splice(selected.indexOf(e.target.id), 1);
      setSelected(selected);
    }
  };

  const selectedDeleteHandler = () => {
    let checkboxAfterDelete = productlist.filter(
      (item) => !selected.includes(item.name)
    );

    let obj = JSON.parse(localStorage.getItem("productsPage"));
    obj = {
      ...obj,
      products: checkboxAfterDelete,
    };
    localStorage.setItem("productsPage", JSON.stringify(obj));

    setProductlist(
      JSON.parse(localStorage.getItem("productsPage"))["products"]
    );

    let selectedall = document.querySelectorAll("input[type=checkbox]:checked");
    for (let i = 0; i < selectedall.length; i++) {
      selectedall[i].checked = false;
    }
  };

  const addNewProduct = () => {
    setModal(true);
  };

  const validateForm = () => {
    if (
      category === "" ||
      description === "" ||
      expireDate === "" ||
      name === "" ||
      stock === "" ||
      !validateImage()
    ) {
      alert("Please enter valid details for the product.");
      return false;
    }
    return true;
  };

  const validateImage = () => {
    if (image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/bmp", "image/svg+xml", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        alert("Invalid image type. Allowed types: JPG, PNG, BMP, SVG, WEBP");
        return false;
      }
      if (image.size > 1024 * 1024) {
        alert("Image size exceeds 1MB limit.");
        return false;
      }
    }
    return true;
  };

  const addProductHandler = () => {
    let obj = JSON.parse(localStorage.getItem("productsPage"));

    if (!validateForm()) {
      return;
    }

    obj.products.push({
      category: category,
      description: description,
      expireDate: expireDate,
      name: name,
      stock: stock,
      image: image ? URL.createObjectURL(image) : null,
    });

    localStorage.setItem("productsPage", JSON.stringify(obj));
    setProductlist(JSON.parse(localStorage.getItem("productsPage"))["products"]);
    setModal(false);

    // Redirect to the Products Page
    window.location.href = "/products";
  };

  const selectDeleteHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {!modal && (
        <div>
          <div className={styles.tablebody}>
            <h2>Products</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Product Name</th>
                  <th>Unit Sold</th>
                  <th>In Stock</th>
                  <th>Expire Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productlist.map((item, i) => (
                  <tr key={i}>
                    <td id={i}>
                      <input
                        type="checkbox"
                        id={item.name}
                        onChange={checkboxHandler}
                      ></input>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.unitSold}</td>
                    <td>{item.stock}</td>
                    <td>{item.expireDate}</td>
                    <td>
                      <i
                        className="fa fa-trash"
                        id={item.name}
                        onClick={deleteHandler}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn" onClick={addNewProduct}>
            Add New Product
          </button>
          <button className="btn" onClick={selectedDeleteHandler} type="reset">
            Delete Selected Products
          </button>
        </div>
      )}
      {modal && (
        <div className={styles.addproductmodal}>
          <h2>Add Product</h2>
          <form onSubmit={selectDeleteHandler}>
            <label htmlFor="Category">Product Name</label>
            <input
              type="text"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
            <label htmlFor="Description">Description</label>
            <textarea
              onChange={(e) => setdescription(e.target.value)}
              value={description}
            ></textarea>
            <label htmlFor="Name">Category</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <div className={styles.addproductmodal2}>
              <label htmlFor="Expiry Date">Expiry Date
                <input
                  type="date"
                  onChange={(e) => setexpireDate(e.target.value)}
                  value={expireDate}
                />
              </label>

              <label htmlFor="Stock">Units in Stock
                <input
                  type="text"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                />
              </label>
            </div>
            <label htmlFor="Image">Upload Image</label>
            <input className={styles.addimage}
              type="file"
              accept=".jpg, .png, .bmp, .svg, .webp"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button className="btn" onClick={addProductHandler}>
              Add Product
            </button>
            <button className="btn" onClick={() => setModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ProductsList;
