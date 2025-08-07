"use client"; 
import Hero from "./component/hero";
import Product from "./component/product";
export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
          <Hero />
          <Product />
      </main>
    </div>
  );
}
