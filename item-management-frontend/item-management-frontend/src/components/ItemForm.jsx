import { useState } from "react";
import api from "../services/api";

function ItemForm({ types, onPurchaseSubmitted }) {
  // Overall purchase state
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  // Current item input state
  const [name, setName] = useState("");
  const [itemTypeId, setItemTypeId] = useState("");
  const [stockAvailable, setStockAvailable] = useState(true);

  // List of items in the current purchase
  const [pendingItems, setPendingItems] = useState([]);
  
  // Status messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Item Name is required");
      return;
    }
    if (!itemTypeId) {
      setError("Item Type is required");
      return;
    }
    if (!purchaseDate) {
      setError("Purchase Date is required");
      return;
    }

    const selectedType = types.find((t) => t.id === parseInt(itemTypeId, 10));

    const newItem = {
      id: Date.now(), // temporary local ID
      name: name.trim(),
      item_type_id: parseInt(itemTypeId, 10),
      type_name: selectedType ? selectedType.type_name : "Unknown",
      stock_available: stockAvailable,
    };

    setPendingItems((prev) => [...prev, newItem]);
    
    // Reset item inputs
    setName("");
    setItemTypeId("");
    setStockAvailable(true);
  };

  const handleRemoveItem = (tempId) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== tempId));
  };

  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pendingItems.length === 0) {
      setError("Please add at least one item to your purchase list.");
      return;
    }

    if (!purchaseDate) {
      setError("Purchase Date is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const requests = pendingItems.map((item) =>
        api.post("/items", {
          name: item.name,
          purchase_date: purchaseDate,
          stock_available: item.stock_available ? 1 : 0,
          item_type_id: item.item_type_id,
        })
      );

      await Promise.all(requests);

      setSuccess(`Successfully registered ${pendingItems.length} items to database!`);
      setPendingItems([]);
      onPurchaseSubmitted();
    } catch (err) {
      console.error("Batch submission failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit purchase. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="purchase-workspace">
      {/* LEFT COLUMN: Input Form */}
      <div className="card form-card">
        <div className="card-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <h3>Add Items to Purchase</h3>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleAddItem} className="purchase-form">
          <div className="form-group">
            <label htmlFor="purchaseDate">Purchase Date</label>
            <input
              id="purchaseDate"
              type="date"
              className="form-control"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          <div className="divider"><span>Item Details</span></div>

          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              id="itemName"
              type="text"
              className="form-control"
              placeholder="e.g. Wireless Mouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemType">Item Type</label>
            <select
              id="itemType"
              className="form-control"
              value={itemTypeId}
              onChange={(e) => setItemTypeId(e.target.value)}
            >
              <option value="">Select Category</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group stock-checkbox-group">
            <label htmlFor="stockAvailable" className="checkbox-container">
              <input
                id="stockAvailable"
                type="checkbox"
                checked={stockAvailable}
                onChange={(e) => setStockAvailable(e.target.checked)}
              />
              <span className="checkmark"></span>
              Item is In Stock
            </label>
          </div>

          <button type="submit" className="btn btn-secondary btn-block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Stage Item for Purchase
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: Staging list / Preview */}
      <div className="card staging-card">
        {pendingItems.length === 0 ? (
          <div className="staging-empty-state">
            <div className="empty-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h4>Staged Items Preview</h4>
            <p className="onboarding-text">
              Your purchase list is currently empty. Fill out the details on the left and click <strong>"Stage Item"</strong> to build your transaction.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-bullet">✓</span>
                <span>Combine multiple items in a single purchase transaction date</span>
              </div>
              <div className="feature-item">
                <span className="feature-bullet">✓</span>
                <span>Review and edit entries before saving to the database</span>
              </div>
              <div className="feature-item">
                <span className="feature-bullet">✓</span>
                <span>Validates fields in real-time</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="staged-list-container">
            <div className="card-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3>Staged Purchase Summary</h3>
            </div>

            <p className="summary-date-info">
              Purchase Transaction Date: <strong>{purchaseDate}</strong>
            </p>

            <div className="table-responsive">
              <table className="table pending-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'center' }}>Stock</th>
                    <th style={{ textAlign: 'right' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item) => (
                    <tr key={item.id}>
                      <td className="item-name-cell"><strong>{item.name}</strong></td>
                      <td><span className="badge badge-type">{item.type_name}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        {item.stock_available ? (
                          <span className="dot dot-success" title="In Stock"></span>
                        ) : (
                          <span className="dot dot-danger" title="Out of Stock"></span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-delete-small"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block btn-submit-purchase"
              onClick={handleSubmitPurchase}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner">Saving Purchase...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Submit Purchase ({pendingItems.length} {pendingItems.length === 1 ? 'Item' : 'Items'})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemForm;