"use client";

import { useState, useEffect } from "react";
import Slider from "rc-slider";
import Link from "next/link";
import "rc-slider/assets/index.css";
import Breadcrumb from "../component/breadcrumb";
import { useCart } from "../store";
import { LuLayoutGrid } from "react-icons/lu";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { Product, BreadcrumbItem } from "../../types";

type GridLayout = 2 | 3;
type PriceRange = [number, number];

export default function ProductFilter() {
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 100]);
  const [activePage, setActivePage] = useState<number>(1);
  const [activeGrid, setActiveGrid] = useState<GridLayout>(2);
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const productsPerPage = 6;
  const addCart = useCart((state) => state.addCart);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://api.escuelajs.co/api/v1/products"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Product[] = await response.json();
        setProductData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const maxPrice = Math.max(...productData.map((p) => Number(p.price)), 100);

  const filteredProducts = productData.filter(
    (product) =>
      Number(product.price) >= priceRange[0] &&
      Number(product.price) <= priceRange[1]
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (activePage - 1) * productsPerPage,
    activePage * productsPerPage
  );

  const handleSliderChange = (value: number | number[]): void => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange([value[0], value[1]]);
      setActivePage(1);
    }
  };

  const handleAddToCart = (product: Product): void => {
    addCart({
      ...product,
      quantity: 1,
    });
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", link: "/" },
    { label: "Product List" },
  ];

  return (
    <div className="flex flex-col mt-3 p-4">
      <div className="flex justify-between">
        <Breadcrumb items={breadcrumbItems} />
        <div className="icons flex mb-5 px-8 py-8 gap-4 items-center">
          <button
            className={`p-2 rounded-sm ${
              activeGrid === 2
                ? "cursor-not-allowed pointer-events-none bg-gray-300"
                : ""
            }`}
            onClick={() => setActiveGrid(2)}
            disabled={activeGrid === 2}
          >
            <LuLayoutGrid />
          </button>
          <button
            className={`p-2 rounded-sm ${
              activeGrid === 3
                ? "cursor-not-allowed pointer-events-none bg-gray-300"
                : ""
            }`}
            onClick={() => setActiveGrid(3)}
            disabled={activeGrid === 3}
          >
            <RiLayoutGrid2Fill />
          </button>
        </div>
      </div>

      <div className="flex w-full gap-x-4">
        <div className="w-1/4">
          <div className="w-full max-w-2xl mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Filter by Price</h2>
            <div className="mb-2">
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
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="text-green-600 font-bold">${priceRange[0]}</span>
              <span className="text-green-600 font-bold">${priceRange[1]}</span>
            </div>
            <div className="mt-2 text-center text-sm">
              Showing {filteredProducts.length} products
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <div
            className={`grid gap-x-10 w-full ${
              activeGrid === 2 ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  className="card w-full shadow-sm rounded-lg mb-5 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  key={product.id}
                >
                  <img
                    src={product.category.image}
                    alt={product.title}
                    height={300}
                    className="w-full  object-contain"
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
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
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
                <p className="text-gray-500">
                  No products found in this price range
                </p>
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
