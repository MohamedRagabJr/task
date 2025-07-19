"use client";

import { useState, useEffect } from "react";
import { useCart } from '../store';
import { Product } from '../../types';

export default function ProductList() {
  const [activePage, setActivePage] = useState<number>(1);
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const productsPerPage = 9;
  const addCart = useCart((state) => state.addCart);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Product[] = await response.json();
        setProductData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching products:', err);
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

  const totalPages = Math.ceil(productData.length / productsPerPage);
  const currentProducts = productData.slice(
    (activePage - 1) * productsPerPage,
    activePage * productsPerPage
  );

  const handleAddToCart = (product: Product): void => {
    addCart({
      ...product,
      quantity: 1,
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-10 w-full">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              className="card w-full shadow-sm rounded-lg mb-5 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              key={product.id}
            >
              <img
                src={product.image}
                alt={product.title}
                height={300}
                className="w-full h-48 object-contain"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 line-clamp-1">{product.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                    Buy Now
                  </button>
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
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="join mt-8 w-full justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`join-item btn ${activePage === page ? 'btn-active' : ''}`}
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
