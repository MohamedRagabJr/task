"use client";

import { useState, useEffect } from "react";
import Swipper from "@/app/component/swipper";
import Breadcrumb from "@/app/component/breadcrumb";
import { useCart } from "@/app/store";
import { useParams } from "next/navigation";
import { Product, BreadcrumbItem } from "../../../types";

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addCart = useCart((state) => state.addCart);
  const params = useParams();
  const productId = params?.id as string;

  const fetchSingleProduct = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Product = await response.json();
      setProduct(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchSingleProduct(productId);
    }
  }, [productId]);

  const handleRefresh = (): void => {
    if (productId) {
      fetchSingleProduct(productId);
    }
  };

  const handleAddToCart = (): void => {
    if (product) {
      addCart({
        ...product,
        quantity: 1,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg mb-4">
          Error loading product: {error}
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">No product found</div>
      </div>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: product.title },
  ];

  return (
    <div className="container">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="left-side">
          <Swipper
            productImages={[
              product.category.image,
              product.category.image,
              product.category.image,
            ]}
          />
        </div>
        <div className="right-side p-4">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="bg-neutral-800 text-neutral-100 px-4 py-2 rounded hover:bg-neutral-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
