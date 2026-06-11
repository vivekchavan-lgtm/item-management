import { useState } from "react";
import api from "../services/api";

function ItemTable({ items, types, refreshItems }) {
  // Editing state
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editItemTypeId, setEditItemTypeId] = useState("");
  const [editPurchaseDate, setEditPurchaseDate] = useState("");
  const [editStockAvailable, setEditStockAvailable] = useState(true);

  // Status messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate statistics for the deck
  const totalCount = items.length;
  const inStockCount = items.filter(
    (item) => item.stock_available === 1 || item.stock_available === true
  ).length;
  const outOfStockCount = totalCount - inStockCount;

  // Helper to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      return localDate.toISOString().split("T")[0];
    } catch (err) {
      return dateString.substring(0, 10);
    }
  };

  // Helper to format date for display (e.g. Jun 12, 2026)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  // Open Edit Modal and prefill data
  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    
    // Find the corresponding item_type_id by matching name with loaded types
    const matchedType = types.find((t) => t.type_name === item.type_name);
    setEditItemTypeId(matchedType ? matchedType.id : "");
    
    setEditPurchaseDate(formatDateForInput(item.purchase_date));
    setEditStockAvailable(item.stock_available === 1 || item.stock_available === true);
    setError("");
    setSuccess("");
  };

  // Close Edit Modal
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Submit Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editName.trim()) {
      setError("Item Name is required");
      return;
    }
    if (!editItemTypeId) {
      setError("Item Type is required");
      return;
    }
    if (!editPurchaseDate) {
      setError("Purchase Date is required");
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/items/${editingItem.id}`, {
        name: editName.trim(),
        purchase_date: editPurchaseDate,
        stock_available: editStockAvailable ? 1 : 0,
        item_type_id: parseInt(editItemTypeId, 10),
      });

      setSuccess("Item updated successfully!");
      setTimeout(() => {
        setEditingItem(null);
        refreshItems();
      }, 800);
    } catch (err) {
      console.error("Failed to update item:", err);
      setError(
        err.response?.data?.message || "Failed to update item. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Item
  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/items/${id}`);
        refreshItems();
      } catch (err) {
        console.error("Failed to delete item:", err);
        alert(err.response?.data?.message || "Failed to delete item.");
      }
    }
  };

  return (
    <div className="inventory-workspace">
      {/* STATS DECK PANEL */}
      <div className="stats-deck">
        <div className="stats-deck-card">
          <div className="stats-icon-wrapper stats-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="15" y2="17"></line>
            </svg>
          </div>
          <div className="stats-details">
            <span className="stats-deck-label">Total Inventory</span>
            <span className="stats-deck-value">{totalCount} items</span>
          </div>
        </div>

        <div className="stats-deck-card">
          <div className="stats-icon-wrapper stats-green">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stats-details">
            <span className="stats-deck-label">In Stock / Available</span>
            <span className="stats-deck-value text-success">{inStockCount} items</span>
          </div>
        </div>

        <div className="stats-deck-card">
          <div className="stats-icon-wrapper stats-red">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="stats-details">
            <span className="stats-deck-label">Out of Stock</span>
            <span className="stats-deck-value text-danger">{outOfStockCount} items</span>
          </div>
        </div>
      </div>

      {/* INVENTORY TABLE CARD */}
      <div className="card table-card">
        <div className="card-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>Registered Inventory Items</h3>
        </div>

        <div className="table-responsive">
          {items.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <p>No inventory items registered yet.</p>
            </div>
          ) : (
            <table className="table main-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Purchase Date</th>
                  <th>Stock Availability</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name-cell">
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-type">{item.type_name}</span>
                    </td>
                    <td>
                      <span className="date-text">{formatDateForDisplay(item.purchase_date)}</span>
                    </td>
                    <td>
                      {item.stock_available === 1 || item.stock_available === true ? (
                        <span className="badge badge-success">
                          <span className="pulse-indicator"></span>
                          In Stock
                        </span>
                      ) : (
                        <span className="badge badge-danger">Out of Stock</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => handleEditClick(item)}
                        title="Edit Item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => handleDeleteClick(item.id, item.name)}
                        title="Delete Item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal Dialog */}
        {editingItem && (
          <div className="modal-overlay">
            <div className="modal-content card">
              <div className="modal-header">
                <h3>Edit Inventory Item</h3>
                <button className="btn-close" onClick={handleCancelEdit}>
                  &times;
                </button>
              </div>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleUpdateSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="editName">Item Name</label>
                  <input
                    id="editName"
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editItemType">Item Type</label>
                  <select
                    id="editItemType"
                    className="form-control"
                    value={editItemTypeId}
                    onChange={(e) => setEditItemTypeId(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="editPurchaseDate">Purchase Date</label>
                  <input
                    id="editPurchaseDate"
                    type="date"
                    className="form-control"
                    value={editPurchaseDate}
                    onChange={(e) => setEditPurchaseDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group checkbox-wrapper">
                  <label htmlFor="editStockAvailable" className="checkbox-container">
                    <input
                      id="editStockAvailable"
                      type="checkbox"
                      checked={editStockAvailable}
                      onChange={(e) => setEditStockAvailable(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    In Stock / Available
                  </label>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemTable;
