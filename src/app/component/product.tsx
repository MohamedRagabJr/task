"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../store";
import { Product } from "../../types";

const FALLBACK_IMAGE = "https://via.placeholder.com/300?text=No+Image";

export default function ProductList() {
  const [activePage, setActivePage] = useState(1);
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productsPerPage = 12;
  const addCart = useCart((state) => state.addCart);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://api.escuelajs.co/api/v1/products", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: Product[] = await res.json();
        setProductData(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return; // Request aborted
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const totalPages = Math.ceil(productData.length / productsPerPage);
  const currentProducts = productData.slice(
    (activePage - 1) * productsPerPage,
    activePage * productsPerPage
  );

  const handleAddToCart = (product: Product) => {
    addCart({ ...product, quantity: 1 });
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null; // prevent infinite loop
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg font-semibold">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-500 text-lg">Error: {error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="card w-full shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
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
                  <div className="flex gap-2">
                    <Link href={`/Product/${product.id}`} passHref>
                      <button className="main-bg text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                        Buy Now
                      </button>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-neutral-800 text-xs add-to-cart text-neutral-100 px-2 py-1 rounded hover:bg-neutral-900 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 w-full">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`px-4 py-2 rounded border ${
                activePage === page
                  ? "main-bg text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
