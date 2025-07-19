"use client"; 
import Product from "./component/product";
export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Featured Content
        </h1>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Our Site</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Explore our collection of featured items in the interactive carousel
            above. Each slide showcases different aspects of our work and
            services.
          </p>
          <Product />
        </div>
      </main>
    </div>
  );
}
