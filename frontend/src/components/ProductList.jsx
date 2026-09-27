function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="muted">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="card product-card" key={product._id}>
          <h3>{product.name}</h3>

          <p className="muted">
            {product.description || "No description"}
          </p>

          <div className="product-meta">
            <strong>₹{product.price}</strong>
            <span>Stock: {product.stock}</span>
          </div>

          <div className="button-row">
            <button
              className="secondary-button"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>

            <button
              className="danger-button"
              onClick={() => onDelete(product._id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductList;
