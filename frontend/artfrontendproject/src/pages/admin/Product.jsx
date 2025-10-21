import React, { useEffect, useState } from "react";
import "../admin/css/Product.scss";
import { FaChevronUp, FaChevronDown, FaCheck } from "react-icons/fa";

export default function Product() {
  const [closeTableColor, setCloseTableColor] = useState(true);
  const handleOpenCloseTable = () => setCloseTableColor(!closeTableColor);

  const [openFilter, setOpenFilter] = useState(true);
  const handleCloseFilter = () => setOpenFilter(!openFilter);

  // const [minPrice, setMinPrice] = useState(1000000);
  // const [maxPrice, setMaxPrice] = useState(4000000);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), filters.maxPrice - 500000);
    setFilters((prev) => ({
      ...prev,
      minPrice: value,
    }));
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), filters.minPrice + 500000);
    setFilters((prev) => ({
      ...prev,
      maxPrice: value,
    }));
  };

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const [filters, setFilters] = useState({
    id: "",
    name: "",
    minPrice: 0,
    maxPrice: 10000000,
    type: "",
    material: "",
    status: "",
    dimension: "",
    color: [],
  });

  const minPercent = (filters.minPrice / 10000000) * 100;
  const maxPercent = (filters.maxPrice / 10000000) * 100;

  const handleResetFilters = () => {
    setFilters({
      id: "",
      name: "",
      minPrice: 0,
      maxPrice: 10000000,
      type: "",
      material: "",
      status: "",
      dimension: "",
      color: [],
    });
  };
  const handleFiltersChange = (key, value) => {
    // setFilters((prev) => ({ ...prev, [key]: value }));
    setFilters((prev) => {
      if (key === "color") {
        const colors = prev.color.includes(value)
          ? prev.color.filter((c) => c !== value)
          : [...prev.color, value];

        return { ...prev, color: colors };
      }

      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    console.log("check filter =>>>>>", filters);
  }, [filters]);

  const [dataFilterCbb, setDataFilterCbb] = useState({});

  const [arts, setArts] = useState({});

  useEffect(() => {
    //call api get dữ liệu cua combobox
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          ...(filters.id && { id: filters.id }),
          ...(filters.name && { name: filters.name }),
          ...(filters.material && { material: filters.material }),
          ...(filters.type && { type: filters.type }),
          ...(filters.dimension && { dimension: filters.dimension }),
          ...(filters.status && { status: filters.status }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.status && { status: filters.status }),
          // Axios đủ thông minh để chuyển nó thành: ...&colors=val1&colors=val2
          color: filters.color,
        };
        // gọi api truyền params vào
      } catch (error) {
        console.error("lỗi khi lọc sản phẩm: ", error);
      }
    };
    fetchProducts();
  }, [filters, currentPage, pageSize]);

  return (
    <div className="product-container">
      <div className="filters-content">
        <div className="filters-title" onClick={handleCloseFilter}>
          FILTERS{" "}
          <span>
            {openFilter ? (
              <FaChevronDown className="open-close-icon" />
            ) : (
              <FaChevronUp className="open-close-icon" />
            )}
          </span>
        </div>

        <div className="clear-container">
          <button className="btn-clear" onClick={handleResetFilters}>
            Clear All
          </button>
        </div>

        <div className={`filters-items ${openFilter ? "open" : "close"}`}>
          <div className="id-item item">
            <div className="id-item_title">ID</div>
            <input
              className="id-item_input"
              type="text"
              value={filters.id}
              onChange={(e) => handleFiltersChange("id", e.target.value.trim())}
            />
          </div>

          <div className="name-item item">
            <div className="name-item_title">TÊN</div>
            <input
              className="name-item_input"
              type="text"
              value={filters.name}
              onChange={(e) =>
                handleFiltersChange("name", e.target.value.trim())
              }
            />
          </div>

          <div className="material-item item">
            <div className="material-item_title">CHẤT LIỆU</div>
            <select
              className="material-combobox"
              value={filters.material}
              onChange={(e) => handleFiltersChange("material", e.target.value)}
            >
              <option value="">Chọn chất liệu</option>
              <option value="canvas">Canvas</option>
              <option value="oil">Sơn dầu</option>
              <option value="acrylic">Acrylic</option>
            </select>
          </div>

          <div className="type-item item">
            <div className="type-item_title">LOẠI TRANH</div>
            <select
              className="type-combobox"
              value={filters.type}
              onChange={(e) => handleFiltersChange("type", e.target.value)}
            >
              <option value="">Chọn loại tranh</option>
              <option value="apple">Táo</option>
              <option value="banana">Chuối</option>
              <option value="orange">Cam</option>
            </select>
          </div>

          <div className="dimension-item item">
            <div className="dimension-item">KÍCH THƯỚC</div>
            <select
              className="dimension-combobox"
              value={filters.dimension}
              onChange={(e) => handleFiltersChange("dimension", e.target.value)}
            >
              <option value="">Chọn kích thước</option>
              <option value="30x40">30x40</option>
              <option value="50x70">50x70</option>
            </select>
          </div>

          <div className="status-item item">
            <div className="status-item_title">TRẠNG THÁI</div>
            <select
              className="status-combobox"
              value={filters.status}
              onChange={(e) => handleFiltersChange("status", e.target.value)}
            >
              <option value="">Chọn trạng thái</option>
              <option value="1">Đang bán</option>
              <option value="0">Ngưng bán</option>
            </select>
          </div>

          <div className="color-item item">
            <div className="color-item_title" onClick={handleOpenCloseTable}>
              MÀU SẮC{" "}
              <span>
                {closeTableColor ? (
                  <FaChevronUp className="open-close-icon" />
                ) : (
                  <FaChevronDown className="open-close-icon" />
                )}
              </span>
            </div>

            <div
              className={`color-item_table ${
                !closeTableColor ? "open" : "close"
              }`}
            >
              {[
                "red",
                "blue",
                "green",
                "yellow",
                "orange",
                "purple",
                "pink",
                "black",
                "white",
                "gray",
                "brown",
                "cyan",
                "magenta",
                "lime",
                "teal",
                "navy",
                "gold",
                "silver",
                "beige",
                "maroon",
              ].map((item, index) => (
                <div
                  key={index}
                  className="color"
                  style={{ background: item }}
                  onClick={() => handleFiltersChange("color", item)}
                >
                  <FaCheck
                    className={`ticked-color ${
                      !filters.color.includes(item) ? "hide" : "show"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="price-item item">
            <div className="price-item_title">GIÁ</div>
            <div className="price-item_slide">
              <div className="slider-container">
                <div
                  className="slider-track"
                  style={{
                    background: `linear-gradient(to right, #d1d5db ${minPercent}%, #06b6d4 ${minPercent}%, #06b6d4 ${maxPercent}%, #d1d5db ${maxPercent}%)`,
                  }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  value={filters.minPrice}
                  onChange={handleMinChange}
                  className="range min-range"
                />
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  value={filters.maxPrice}
                  onChange={handleMaxChange}
                  className="range max-range"
                />
              </div>
              <div className="price-info">
                <span>{formatCurrency(filters.minPrice)}</span> —{" "}
                <span>{formatCurrency(filters.maxPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="show-arts">
        <div className="show-arts_title">TẤT CẢ SẢN PHẨM</div>
        <div className="show-arts_content">
          {/* hiển thị sản phẩm theo filters */}
        </div>
      </div>
    </div>
  );
}
