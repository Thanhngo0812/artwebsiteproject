import React, { useState, useEffect } from "react";
import "./css/ProductUser.scss";
import {
  FaChevronUp,
  FaChevronDown,
  FaCheck,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

export default function ProductUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryNameFromUrl = searchParams.get("category");

  const reset = searchParams.get("reset");
  useEffect(() => {
    if (reset === "true") {
      setFilters({
        categories: [],
        materials: [],
        priceRange: {
          minPrice:0,
          maxPrice: 30000000,
        },
        colors: [],
        dimensions: [],
        topics: [],
      });

      axios
        .get("http://localhost:8888/api/v1/filters/products")
        .then((response) => setListFilters(response.data))
        .catch((error) => console.log("Lỗi khi reset filters:", error));

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("reset");
      newParams.delete("_");

      setSearchParams(newParams);
    }
  }, [reset, searchParams, setSearchParams]);

  const [listFilters, setListFilters] = useState({});
  const [filters, setFilters] = useState({
    categories: [],
    materials: [],
    priceRange: {
      minPrice: 0,
      maxPrice: 30000000,
    },
    colors: [],
    dimensions: [],
    topics: [],
  });
  // const [sort, setSort] = useState("new");
  const [sort, setSort] = useState("productName,asc");
  const handleChangeOptionSort = (value) => {
    setSort(value);
  };
 
  /**
 * Hàm này nhận một mảng các đối tượng (mỗi đối tượng có key 'id')
 * và trả về một mảng mới chỉ chứa các giá trị 'id'.
 *
 * @param {Array<Object>} inputArray - Mảng các đối tượng đầu vào.
 * @returns {Array<number>} - Mảng chỉ chứa các ID.
 */
  function getIdsFromArray(inputArray) {
    // Nếu inputArray không phải là mảng (ví dụ: undefined) hoặc rỗng,
    // hàm map vẫn sẽ trả về mảng rỗng [].
    if (!Array.isArray(inputArray)) {
      return [];
    }
    return inputArray.map(item => item.id);
  }
  const [openCategories, setOpenCategories] = useState([]);

  // SỬA LỖI: Dùng useEffect để CẬP NHẬT state
  // khi 'listFilters.categories' thay đổi
  useEffect(() => {
    // Chỉ chạy khi listFilters.categories CÓ dữ liệu
    if (listFilters.categories && listFilters.categories.length > 0) {
      const initialIds = getIdsFromArray(listFilters.categories);
      setOpenCategories(initialIds);
    } else {
      // Nếu filter bị xóa, cũng xóa state
      setOpenCategories([]);
    }
    // Bất cứ khi nào listFilters.categories thay đổi,
    // hãy chạy lại hàm này.
  }, []);
  const toggleCategory = (categoryId) => {
    setOpenCategories((prevOpenCategories) => {
      // Nếu ID đã có trong mảng (đang mở)
      if (prevOpenCategories.includes(categoryId)) {
        // Loại bỏ ID (đóng)
        return prevOpenCategories.filter((id) => id !== categoryId);
      } else {
        // Thêm ID (mở)
        return [...prevOpenCategories, categoryId];
      }
    });
  };
  const [openMaterial, setOpenMaterial] = useState(false);
  const toggleMaterial = () => {
    setOpenMaterial(!openMaterial);
  };
  const [openPrice, setOpenPrice] = useState(false);
  const togglePrice = () => {
    setOpenPrice(!openPrice);
  };
  const [openDimension, setOpenDimension] = useState(false);
  const toggleDimension = () => {
    setOpenDimension(!openDimension);
  };
  const [openTopic, setOpenTopic] = useState(false);
  const toggleTopic = () => {
    setOpenTopic(!openTopic);
  };

  const fetchDynamicFilters = async (categories) => {
    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/filters/products-dynamic",
        { categories: categories }
      );
      setListFilters(response.data);
    } catch (error) {
      console.error("Lỗi khi tải lại filters động:", error);
    }
  };

  useEffect(() => {
    const fetchListFilters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/v1/filters/products"
        );
        setListFilters(response.data);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách filter: ", error);
      }
    };
    fetchListFilters();
  }, []);

  useEffect(() => {
    if (categoryNameFromUrl && listFilters.categories) {
      let foundCategory = null;

      foundCategory = listFilters.categories.find(
        (c) => c.name === categoryNameFromUrl
      );

      if (!foundCategory) {
        for (const parent of listFilters.categories) {
          foundCategory = parent.children?.find(
            (child) => child.name === categoryNameFromUrl
          );
          if (foundCategory) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("category");

            setSearchParams(newParams);
            break;
          }
        }
      }

      if (foundCategory) {
        const categoryId = foundCategory.id;

        if (!filters.categories.includes(categoryId)) {
          setFilters((prev) => {
            const newCategories = [categoryId];

            fetchDynamicFilters(newCategories);

            return {
              ...prev,
              categories: newCategories,
              materials: [],
              priceRange: { minPrice: 0, maxPrice: 30000000 },
              colors: [],
              dimensions: [],
              topics: [],
            };
          });
          // setCurrentPage(1);

          const newParams = new URLSearchParams(searchParams);
          newParams.delete("category");

          setSearchParams(newParams);
        }
      }
    }
  }, [
    categoryNameFromUrl,
    filters.categories,
    listFilters.categories,
    searchParams,
    setSearchParams,
  ]);

  const handleArrayFilterChange = (key, value) => {
    setFilters((prev) => {
      if (key === "materials" || key === "dimensions" || key === "topics") {
        const currentArray = prev[key];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value];
        return { ...prev, [key]: newArray };
      }

      if (key === "categories") {
        const currentCategories = prev.categories;
        let newCategories;
        let categoryToUnselect = null;

        const parentOfValue = listFilters.categories?.find((c) =>
          c.children?.some((child) => child.id === value)
        );
        const isChild = !!parentOfValue;

        const parentCategory = listFilters.categories?.find(
          (c) => c.id === value
        );
        const isParent = !!parentCategory;

        if (currentCategories.includes(value)) {
          newCategories = currentCategories.filter((v) => v !== value);
        } else {
          newCategories = [...currentCategories, value];

          if (isChild) {
            if (currentCategories.includes(parentOfValue.id)) {
              categoryToUnselect = parentOfValue.id;
            }
          }
        }

        if (!currentCategories.includes(value) && isParent) {
          const childrenIds =
            parentCategory.children?.map((child) => child.id) || [];
          newCategories = newCategories.filter(
            (id) => !childrenIds.includes(id)
          );
        }

        let finalCategories = newCategories;
        if (categoryToUnselect) {
          finalCategories = finalCategories.filter(
            (v) => v !== categoryToUnselect
          );
        }

        fetchDynamicFilters(finalCategories);

        return {
          ...prev,
          categories: finalCategories,
          materials: [],
          priceRange: {
            minPrice: 0,
            maxPrice: 30000000,
          },
          colors: [],
          dimensions: [],
          topics: [],
        };
      }

      return prev;
    });
  };

  const handleFiltersChangeColor = (key, value) => {
    setFilters((prev) => {
      if (key === "colors") {
        const colors = prev.colors.includes(value)
          ? prev.colors.filter((c) => c !== value)
          : [...prev.colors, value];

        return { ...prev, colors: colors };
      }
      return prev;
    });
  };

  useEffect(() => {
    console.log("check filter =>>>>>", filters);
  }, [filters]);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [pageSize, setPageSize] = useState(10);
  const pageSize = 10;

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleMinChange = (e) => {
    const value = Math.min(
      Number(e.target.value),
      filters.priceRange.maxPrice - 500000
    );
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        minPrice: value,
      },
    }));
  };

  const handleMaxChange = (e) => {
    const value = Math.max(
      Number(e.target.value),
      filters.priceRange.minPrice + 500000
    );
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        maxPrice: value,
      },
    }));
  };

  const minPercent = (filters.priceRange.minPrice / 30000000) * 100;
  const maxPercent = (filters.priceRange.maxPrice / 30000000) * 100;

  const [closeTableColor, setCloseTableColor] = useState(false);
  const handleOpenCloseTable = () => setCloseTableColor(!closeTableColor);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          // page: currentPage,
          // size: pageSize,
          categories: filters.categories.join(","),
          materials: filters.materials.join(","),
          minPrice: filters.priceRange.minPrice,
          maxPrice: filters.priceRange.maxPrice,
          colors: filters.colors.join(","),
          dimensions: filters.dimensions.join(","),
          topics: filters.topics.join(","),
        };

        const response = await axios.post(
          `http://localhost:8888/api/products/search?page=${
            currentPage - 1
          }&size=${pageSize}&sort=${sort}`,
          filters
        );
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        console.log(response.data.content);
        // console.log("Params gửi API tìm kiếm:", params);
      } catch (error) {
        console.error("lỗi khi lọc sản phẩm: ", error);
      }
    };
    fetchProducts();
  }, [filters, currentPage, pageSize, sort]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, sort]);

  const handleBackToShop = () => {
    const unique = Date.now();
    window.location.href = `/products?reset=true&_=${unique}`;
  };

  const [openFilterResponsive, setOpenFilterResponsive] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 721) {
        setOpenFilterResponsive(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.warn(products);
  return (
    <div className="productUser-container">
      <div
        className={`list-filter-reponsive ${
          openFilterResponsive ? "active" : ""
        }`}
      >
        <div className="list-filter-reponsive-title">
          <span>Filters</span>
          <span
            className="icon-close-filter-reponsive"
            onClick={() => setOpenFilterResponsive(!openFilterResponsive)}
          >
            <FaTimes />
          </span>
        </div>
        <div className="productUser-filter">
          <div className="productUser-filter-content">
            <div style={{
    borderBottom: '1px solid #212121BF'
  }}>
            <h4>LOẠI TRANH</h4>
            {listFilters.categories?.length > 0 &&
              listFilters.categories.map((item, index) => {
                // Kiểm tra xem danh mục hiện tại có đang mở hay không
                const childIds = item.children?.map(child => child.id) || [];
                const selectedChildrenCount = childIds.filter(id => filters.categories.includes(id)).length;
                const isCategoryOpen = !openCategories.includes(item.id); // <--- KIỂM TRA TRẠNG THÁI
            
                return (
                  <div  className="categories-content" key={item.id}>
                    {/* Thêm onClick vào div cha để toggle */}
                    <div

                      className="categories-content-name"
                      onClick={() => toggleCategory(item.id)} // <--- THÊM ONCLICK
                    >
                      {/* Thay đổi icon dựa trên trạng thái đóng/mở (Dùng FaChevronUp/Down) */}
                      <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(item.id)}
                        onChange={() =>
                          handleArrayFilterChange("categories", item.id)
                        }
                        onClick={(e) => e.stopPropagation()} // <--- QUAN TRỌNG: Ngăn chặn click checkbox làm đóng/mở
                      />
                     <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>
          {item.name}
          {selectedChildrenCount > 0 && ` (${selectedChildrenCount})`}
        </span>
                    </div>

                    {/* CHỈ HIỂN THỊ mục con nếu danh mục đang mở (isCategoryOpen là true) */}
                    {item.children?.length > 0 &&
                      !isCategoryOpen && // <--- SỬ DỤNG isCategoryOpen
                      item.children.map((child, childIndex) => (
                        <div
                          className="categories-content-child"
                          key={child.id}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(child.id)}
                              onChange={() =>
                                handleArrayFilterChange("categories", child.id)
                              }
                            />
                            <span>{child.name}</span>
                          </label>
                        </div>
                      ))}
                  </div>
                );
              })}</div>

            <div className="materials-content">
              <div className="materials-content-name" onClick={toggleMaterial}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openMaterial ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>Chất Liệu</span>
              </div>
              {listFilters.materials?.length > 0 &&
                openMaterial &&
                listFilters.materials.map((item, index) => (
                  <div className="materials-content-child" key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(item.id)}
                        onChange={() =>
                          handleArrayFilterChange("materials", item.id)
                        }
                      />
                      <span>{item.materialname}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="price-item item">
              <div className="price-item_title" onClick={togglePrice}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openPrice ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>GIÁ</span>
              </div>
              {openPrice && (
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
                      max="30000000"
                      value={filters.priceRange.minPrice}
                      onChange={handleMinChange}
                      className="range min-range"
                    />
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      value={filters.priceRange.maxPrice}
                      onChange={handleMaxChange}
                      className="range max-range"
                    />
                  </div>
                  <div className="price-info">
                    <span>{formatCurrency(filters.priceRange.minPrice)}</span> —{" "}
                    <span>{formatCurrency(filters.priceRange.maxPrice)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="dimensions-content">
              <div className="dimensions-title" onClick={toggleDimension}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openDimension ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>KÍCH THƯỚC</span>
              </div>
              {listFilters.dimensions?.length > 0 &&
                openDimension &&
                listFilters.dimensions.map((item, index) => (
                  <div className="dimensions-item" key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.dimensions.includes(item)}
                        onChange={() =>
                          handleArrayFilterChange("dimensions", item)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="topics-content">
              <div className="topics-title" onClick={toggleTopic}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openTopic ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>CHỦ ĐỀ</span>
              </div>
              {listFilters.topics?.length > 0 &&
                openTopic &&
                listFilters.topics.map((item, index) => (
                  <div className="topics-item" key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.topics.includes(item)}
                        onChange={() => handleArrayFilterChange("topics", item)}
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
            </div>

            
            <div className="color-item item">
              <div className="color-item_title" onClick={handleOpenCloseTable}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: closeTableColor ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>MÀU SẮC</span>
              </div>

              <div
                className={`color-item_table ${
                  closeTableColor ? "open" : "close"
                }`}
              >
                {listFilters.colors?.length > 0 &&
                  listFilters.colors.map((item, index) => (
                    <div
                      key={index}
                      className="color"
                      style={{ background: item }}
                      onClick={() => handleFiltersChangeColor("colors", item)}
                    >
                      <FaCheck
                        className={`ticked-color ${
                          !filters.colors.includes(item) ? "hide" : "show"
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="productUser-title">Danh sách "TRANH XỊN"</div>
      <div className="productUser-content">
        <div className="productUser-filter">
          <div className="productUser-filter-title">
            <div
              className="productUser-filter-title-name"
              onClick={() => setOpenFilterResponsive(!openFilterResponsive)}
            >
              <span className="icon-filter-reponsive">
                <FaSlidersH />
              </span>
              Filters
            </div>
            <div className="clear-all-filters" onClick={handleBackToShop}>
              clear all filters
            </div>
          </div>
          <div className="productUser-filter-content">
          <div >
          <h4>LOẠI TRANH</h4>
            {/* {listFilters.categories?.length > 0 &&
              listFilters.categories.map((item, index) => (
                <div className="categories-content" key={item.id}>
                  <div className="categories-content-name">
                    <FaChevronUp />
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(item.id)}
                      onChange={() =>
                        handleArrayFilterChange("categories", item.id)
                      }
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.children?.length > 0 &&
                    item.children.map((child, childIndex) => (
                      <div className="categories-content-child" key={child.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(child.id)}
                            onChange={() =>
                              handleArrayFilterChange("categories", child.id)
                            }
                          />
                          <span>{child.name}</span>
                        </label>
                      </div>
                    ))}
                </div>
              ))} */}

            {listFilters.categories?.length > 0 &&
              listFilters.categories.map((item, index) => {
                // Kiểm tra xem danh mục hiện tại có đang mở hay không
                const childIds = item.children?.map(child => child.id) || [];
                const selectedChildrenCount = childIds.filter(id => filters.categories.includes(id)).length;
                const isCategoryOpen = !openCategories.includes(item.id); // <--- KIỂM TRA TRẠNG THÁI
            
                return (
                  
                  <div  className="categories-content" key={item.id}>
                    
                    {/* Thêm onClick vào div cha để toggle */}
                    <div
                      className="categories-content-name"
                      onClick={() => toggleCategory(item.id)} // <--- THÊM ONCLICK
                    >
                      {/* Thay đổi icon dựa trên trạng thái đóng/mở (Dùng FaChevronUp/Down) */}
                      <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(item.id)}
                        onChange={() =>
                          handleArrayFilterChange("categories", item.id)
                        }
                        onClick={(e) => e.stopPropagation()} // <--- QUAN TRỌNG: Ngăn chặn click checkbox làm đóng/mở
                      />
                      <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>
          {item.name}
          {selectedChildrenCount > 0 && ` (${selectedChildrenCount})`}
        </span>
                    </div>

                    {/* CHỈ HIỂN THỊ mục con nếu danh mục đang mở (isCategoryOpen là true) */}
                    {item.children?.length > 0 &&
                      !isCategoryOpen && // <--- SỬ DỤNG isCategoryOpen
                      item.children.map((child, childIndex) => (
                        <div
                          className="categories-content-child"
                          key={child.id}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(child.id)}
                              onChange={() =>
                                handleArrayFilterChange("categories", child.id)
                              }
                            />
                            <span>{child.name}</span>
                          </label>
                        </div>
                      ))}
                  </div>
                );
              })}</div>

            <div className="materials-content">
              <div className="materials-content-name" onClick={toggleMaterial}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openMaterial ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>CHẤT LIỆU</span>
              </div>
              {listFilters.materials?.length > 0 &&
                openMaterial &&
                listFilters.materials.map((item, index) => (
                  <div className="materials-content-child" key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(item.id)}
                        onChange={() =>
                          handleArrayFilterChange("materials", item.id)
                        }
                      />
                      <span>{item.materialname}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="price-item item" >
              <div className="price-item_title" onClick={togglePrice}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openPrice ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />{" "}
                <span style={{  fontWeight: 'bold' }}>GIÁ</span>
              </div>
              {openPrice && (
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
                      max="30000000"
                      value={filters.priceRange.minPrice}
                      onChange={handleMinChange}
                      className="range min-range"
                    />
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      value={filters.priceRange.maxPrice}
                      onChange={handleMaxChange}
                      className="range max-range"
                    />
                  </div>
                  <div className="price-info">
                    <span>{formatCurrency(filters.priceRange.minPrice)}</span> —{" "}
                    <span>{formatCurrency(filters.priceRange.maxPrice)}</span>
                  </div>
                </div>
              )}
            </div>

       
            <div className="dimensions-content"  >
              <div className="dimensions-title" onClick={toggleDimension}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openDimension ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>KÍCH THƯỚC</span>
              </div>
              {listFilters.dimensions?.length > 0 &&
                openDimension &&
                listFilters.dimensions.map((item, index) => (
                  <div className="dimensions-item" key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.dimensions.includes(item)}
                        onChange={() =>
                          handleArrayFilterChange("dimensions", item)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="topics-content" >
              <div className="topics-title" onClick={toggleTopic}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: openTopic ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>CHỦ ĐỀ</span>
              </div>
              {listFilters.topics?.length > 0 &&
                openTopic &&
                listFilters.topics.map((item, index) => (
                  <div className="topics-item" key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.topics.includes(item)}
                        onChange={() => handleArrayFilterChange("topics", item)}
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="color-item item" >
              <div className="color-item_title" onClick={handleOpenCloseTable}>
              <FaChevronUp // CHỈ DÙNG MỘT ICON (ví dụ: icon trỏ lên)
                            style={{
                              transform: closeTableColor ? 'rotate(0deg)' : 'rotate(180deg)',
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block' 
                            }}
                          />
                <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>MÀU SẮC</span>
              </div>

              <div
                className={`color-item_table ${
                  closeTableColor ? "open" : "close"
                }`}
              >
                {listFilters.colors?.length > 0 &&
                  listFilters.colors.map((item, index) => (
                    <div
                      key={index}
                      className="color"
                      style={{ background: item }}
                      onClick={() => handleFiltersChangeColor("colors", item)}
                    >
                      <FaCheck
                        className={`ticked-color ${
                          !filters.colors.includes(item) ? "hide" : "show"
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
        <div className="productUser-showProduct">
          <div className="sort-container">
            <span>Sắp xếp theo: </span>
            <select
              value={sort}
              onChange={(e) => handleChangeOptionSort(e.target.value)}
            >
              <option value="new">Mới nhất</option>
              <option value="salesCount,desc">Bán chạy</option>
              <option value="productName,asc">Thứ tự từ A đến Z</option>
              <option value="productName,desc">Thứ tự từ Z đến A</option>
              <option value="minPrice,asc">Giá từ thấp đến cao</option>
              <option value="minPrice,desc">Giá từ cao đến thấp</option>
              <option value="old">Cũ hơn</option>
            </select>
          </div>
          <div className="main-show-product">
            {products && products.length > 0 ? (
              products.map((item, index) => (
                <div className="product-item" key={item.id}>
                <div className="product-thumbnail">
                    <img src={item.thumbnail} alt="img product invalid" />
                    
                    {item.promotionalPrice && (
                        <span className="sale-badge">SALE</span>
                    )}
                </div>
                <div className="product-name">{item.productName}</div>
            
                <div className="product-price">
                    {
                        item.promotionalPrice ? 
                        (
                            <>
                                <span className="promo-price">
                                    Từ {formatCurrency(item.promotionalPrice)}
                                </span>
                                <span className="strikethrough-price">
                                    {formatCurrency(item.originalPrice)}
                                </span>
                            </>
                        ) : 
                        (
                            <span className="normal-price">
                                Từ {formatCurrency(item.originalPrice)}
                            </span>
                        )
                    }
                </div>
            </div>
              ))
            ) : (
              <div className="product-not-found">
                <div className="product-not-found-title">
                  Không có sản phẩm nào được tìm thấy!
                </div>
                <div className="back-to-shop" onClick={handleBackToShop}>
                  Trở lại
                </div>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="›"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="‹"
              renderOnZeroPageCount={null}
              containerClassName="pagination"
              pageLinkClassName="page-num"
              previousLinkClassName="page-num"
              nextLinkClassName="page-num"
              activeLinkClassName="active"
              forcePage={currentPage - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
