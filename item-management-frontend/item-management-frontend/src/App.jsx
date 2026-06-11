import { useState, useEffect } from "react";
import ItemForm from "./components/ItemForm";
import ItemTable from "./components/ItemTable";
import api from "./services/api";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("purchase"); // 'purchase' or 'inventory'

  // Fetch all items
  const fetchItems = async () => {
    try {
      const response = await api.get("/items");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to connect to the backend server. Please verify MySQL and backend server are running.");
    }
  };

  // Fetch all item types
  const fetchTypes = async () => {
    try {
      const response = await api.get("/items/types");
      setTypes(response.data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchItems(), fetchTypes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Compute stats
  const totalItems = items.length;
  const inStockItems = items.filter(
    (item) => item.stock_available === 1 || item.stock_available === true
  ).length;

  // Handle successful purchase
  const handlePurchaseSubmitted = async () => {
    await fetchItems();
    // Automatically navigate to inventory to see the new stock
    setActiveTab("inventory");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div>
            <h1>InvenTrack</h1>
            <p className="subtitle">Classic Item & Inventory Management</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === "purchase" ? "active" : ""}`}
            onClick={() => setActiveTab("purchase")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            New Purchase
          </button>
          <button
            className={`tab-btn ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="15" y2="17"></line>
            </svg>
            Stock Inventory
            <span className="tab-badge">{totalItems}</span>
          </button>
        </div>

        {/* Quick Summary Badges */}
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-label">In Stock:</span>
            <span className="stat-value text-success">{inStockItems}</span>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="main-content">
        {loading ? (
          <div className="loader-container">
            <div className="custom-loader"></div>
            <p>Loading database information...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger error-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="tab-pane-content">
            {activeTab === "purchase" ? (
              <ItemForm types={types} onPurchaseSubmitted={handlePurchaseSubmitted} />
            ) : (
              <ItemTable items={items} types={types} refreshItems={fetchItems} />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} InvenTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;