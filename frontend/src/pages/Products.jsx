import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api.js";
import ProductForm from "../components/ProductForm.jsx";
import ProductList from "../components/ProductList.jsx";

function Products({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSave(form) {
    setError("");

    try {
      if (editingProduct) {
        const data = await updateProduct(editingProduct._id, form);

        setProducts((current) =>
          current.map((product) =>
            product._id === editingProduct._id
              ? data.product
              : product
          )
        );

        setEditingProduct(null);
      } else {
        const data = await createProduct(form);
        setProducts((current) => [data.product, ...current]);
      }
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    setError("");

    try {
      await deleteProduct(id);
      setProducts((current) =>
        current.filter((product) => product._id !== id)
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Products</h1>
          <p className="muted">Logged in as {user?.name}</p>
        </div>

        <button className="secondary-button" onClick={onLogout}>
          Logout
        </button>
      </header>

      {error && <div className="error-box">{error}</div>}

      <section className="layout">
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />

        <section>
          <div className="section-header">
            <h2>Product list</h2>
            <button className="secondary-button" onClick={loadProducts}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <ProductList
              products={products}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
            />
          )}
        </section>
      </section>
    </main>
  );
}

export default Products;
