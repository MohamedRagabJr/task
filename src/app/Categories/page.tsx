"use client";

import { useState, useEffect } from "react";
import Slider from "rc-slider";
import Link from "next/link";
import "rc-slider/assets/index.css";
import Breadcrumb from "../component/breadcrumb";
import { useCart } from "../store";
import { LuLayoutGrid } from "react-icons/lu";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { Product, BreadcrumbItem } from "../../types";
const FALLBACK_IMAGE = "https://via.placeholder.com/300?text=No+Image";

type GridLayout = 2 | 3 | 4;
type PriceRange = [number, number];

interface Category {
  id: number;
  name: string;
  image: string;
}

export default function ProductFilter() {
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 100]);
  const [activePage, setActivePage] = useState(1);
  const [activeGrid, setActiveGrid] = useState<GridLayout>(2);
  const [productData, setProductData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productsPerPage = 6;
  const addCart = useCart((state) => state.addCart);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://api.escuelajs.co/api/v1/products");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Product[] = await res.json();
        setProductData(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.escuelajs.co/api/v1/categories");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const maxPrice = Math.max(...productData.map((p) => Number(p.price)), 100);

  // Apply filters
  const filteredProducts = productData.filter((product) => {
    const matchesPrice =
      Number(product.price) >= priceRange[0] &&
      Number(product.price) <= priceRange[1];

    const matchesCategory =
      selectedCategory === null || product.category.id === selectedCategory;

    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesPrice && matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (activePage - 1) * productsPerPage,
    activePage * productsPerPage
  );

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange([value[0], value[1]]);
      setActivePage(1);
    }
  };
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null; // prevent infinite loop
  };

  const handleAddToCart = (product: Product) => {
    addCart({ ...product, quantity: 1 });
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", link: "/" },
    { label: "Product List" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-3 p-4">
      <div className="flex justify-between main-bg-100 align-middle mb-9">
        <Breadcrumb items={breadcrumbItems} />
        <div className="icons flex px-8 py-8 gap-4 items-center">
          {[
            { size: 2, icon: <LuLayoutGrid /> },
            { size: 3, icon: <RiLayoutGrid2Fill /> },
            { size: 4, icon: <TfiLayoutGrid4Alt /> },
          ].map(({ size, icon }) => (
            <button
              key={size}
              className={`p-2 rounded-sm ${
                activeGrid === size ? "bg-gray-300 cursor-not-allowed" : ""
              }`}
              onClick={() => setActiveGrid(size as GridLayout)}
              disabled={activeGrid === size}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full gap-x-4">
        {/* Sidebar Filters */}
        <div className="w-1/4">
          {/* Search */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-3">Search</h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActivePage(1);
              }}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Categories */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-3">Categories</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setActivePage(1);
                  }}
                  className={`w-full text-left p-2 rounded ${
                    selectedCategory === null
                      ? "main-bg text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActivePage(1);
                    }}
                    className={`w-full text-left p-2 rounded ${
                      selectedCategory === cat.id
                        ? "main-bg text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Filter by Price</h2>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={handleSliderChange}
              allowCross={false}
              trackStyle={[{ backgroundColor: "#3b82f6" }]}
              handleStyle={[
                { borderColor: "#3b82f6", backgroundColor: "#fff" },
                { borderColor: "#3b82f6", backgroundColor: "#fff" },
              ]}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span className="text-green-600 font-bold">${priceRange[0]}</span>
              <span className="text-green-600 font-bold">${priceRange[1]}</span>
            </div>
            <div className="mt-2 text-center text-sm">
              Showing {filteredProducts.length} products
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="w-3/4">
          <div
            className={`grid gap-x-10 w-full ${
              activeGrid === 2
                ? "grid-cols-2"
                : activeGrid === 3
                ? "grid-cols-3"
                : "grid-cols-4"
            }`}
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  className="card w-full shadow-sm rounded-lg mb-5 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  key={product.id}
                >
                  <img
                    src={product.category?.image || FALLBACK_IMAGE}
                    alt={product.title}
                    height={300}
                    className="w-full h-64 object-contain bg-gray-50"
                    onError={handleImageError}
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold mb-2 line-clamp-1">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">
                        ${product.price.toFixed(2)}
                      </span>
                      <Link href={`/Product/${product.id}`} passHref>
                        <button className="main-bg text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                          Buy Now
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-neutral-800 text-[0.8rem] text-neutral-100 p-1 rounded add-to-cart"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 w-full">
                <p className="text-gray-500">No products match your filters</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="join mt-8 w-full justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`join-item btn ${
                      activePage === page ? "btn-active" : ""
                    }`}
                    onClick={() => setActivePage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
