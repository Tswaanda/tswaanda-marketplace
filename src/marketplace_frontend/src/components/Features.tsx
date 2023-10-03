import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import Loader from "./Loader";
import { useAuth } from "./ContextWrapper";

const Features = (props) => {
  const { adminBackendActor } = useAuth()
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const products = await adminBackendActor.getAllProducts();
      setProducts(products);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("Error", e);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center px-7 lg:px-28 pt-8 pb-10 h-[70vh]">
        <Loader />
      </div>
    );

  return (
    <section className="">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl mb-16 font-bold tracking-tight text-primary">
          Best Selling Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products?.slice(0, 3).map((product) => (
            <div className="group relative" key={product.id}>
              <div className="flex justify-center w-full lg:aspect-none lg:h-80">
                <ProductCard
                  key={product.id}
                  id={String(product.id)}
                  type={product.name}
                  desc={product.shortDescription}
                  image={product.images[0]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
