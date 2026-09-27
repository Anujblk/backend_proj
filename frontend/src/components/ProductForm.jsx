import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
};

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
      });
    } else {
      setForm(emptyForm);
    }

    setError("");
    setFieldErrors([]);
  }, [product]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
    setFieldErrors((current) => current.filter((item) => item.field !== name));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setLoading(true);

    try {
      await onSave({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      if (!product) {
        setForm(emptyForm);
      }
    } catch (requestError) {
      setError(requestError.message);
      setFieldErrors(requestError.data?.errors || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card product-form" onSubmit={handleSubmit}>
      <h2>{product ? "Edit product" : "Add product"}</h2>

      {error && <div className="error-box">{error}</div>}
      {fieldErrors.map((item) => (
        <div className="field-error" key={`${item.field}-${item.message}`}>
          {item.field}: {item.message}
        </div>
      ))}

      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />
      </label>

      <label>
        Price
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Stock
        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={handleChange}
          required
        />
      </label>

      <div className="button-row">
        <button disabled={loading}>
          {loading
            ? "Saving..."
            : product
              ? "Update product"
              : "Add product"}
        </button>

        {product && (
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
