import "./css/Header.css";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [children, setChildren] = useState({});
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8888/api/v1/categories/parents")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.log(error.message));
  }, []);

  const handleCategoryClick = (cat, idx) => {
    if (openIndex === idx) {
      setOpenIndex(null);
      return;
    }
    setOpenIndex(idx);
    if (cat && cat.id && !children[cat.id]) {
      fetch(`http://localhost:8888/api/v1/categories/${cat.id}/children`)
        .then((res) => res.json())
        .then((data) => {
          setChildren((prev) => ({ ...prev, [cat.id]: data }));
        }).catch((error) => console.log(error));
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <span className="nav-logo" style={{ marginRight: 16 }}>
          <img
            src="/logo192.png"
            alt="Logo"
            style={{ height: 36, width: "auto" }}
          />
        </span>
        <span className="nav-item shop">Shop</span>
        {categories.map((cat, idx) => (
          <div
            className="nav-item category"
            key={cat.id}
            tabIndex={0}
            onClick={() => handleCategoryClick(cat, idx)}
            onBlur={() => setOpenIndex(null)}
          >
            <span className={openIndex === idx ? "active" : ""}>{cat.name}</span>
            {openIndex === idx && (
              <div className="dropdown">
                {(children[cat.id] || []).map((child) => (
                  <div className="dropdown-item" key={child.id}>
                    {child.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}