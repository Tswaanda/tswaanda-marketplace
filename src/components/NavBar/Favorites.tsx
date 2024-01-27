import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import Loader from "../Loader";
import { useAuth } from "../../hooks/ContextWrapper";
import { set } from "zod";

export default function Favorites({ openFavourites, setOpenFavourites }) {
  const { backendActor, identity, favouritesUpdated, setFavouritesUpdated } =
    useAuth();

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleContinueShopping = () => {
    setOpenFavourites(false);
    navigate("/market");
  };

  const getFavourites = async () => {
    try {
      setLoading(true);
      const response = await backendActor.getMyFavItems();
      setProducts(response);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching favourites products", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendActor) {
      getFavourites();
    }
  }, [backendActor]);

  const handleRemove = async (id: string) => {
    try {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      await backendActor.removeFromFavourites(id);
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    if (favouritesUpdated) {
      getFavourites();
      setFavouritesUpdated(false);
    }
  }, [favouritesUpdated]);

  return (
    <Transition.Root show={openFavourites} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setOpenFavourites(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Favorite Products
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpenFavourites(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      {loading ? (
                        <div className="flex justify-center items-center px-7 lg:px-28 pt-8 pb-10 h-[70vh]">
                          <Loader />
                        </div>
                      ) : (
                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {products.map((product) => (
                                <li key={product.id} className="flex py-6">
                                  <div
                                    onClick={() => {
                                      setOpenFavourites(false);
                                      navigate(`/product/${product.id}`);
                                    }}
                                    className="hover:cursor-pointer h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                                  >
                                    <img
                                      src={product.images[0]}
                                      alt={product.imageAlt}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <button
                                            onClick={() => {
                                              setOpenFavourites(false);
                                              navigate(
                                                `/product/${product.id}`
                                              );
                                            }}
                                          >
                                            {product.name}
                                          </button>
                                        </h3>
                                        <p className="ml-4">
                                          $ {product.price}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.availability}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        Min Order{" "}
                                        <span className="text-gray-800">
                                          {product.minOrder} Tonne
                                        </span>
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemove(product.id)
                                          }
                                          className="font-medium text-primary hover:text-secondary"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <button
                          type="button"
                          className="font-medium text-primary hover:text-secondary"
                          onClick={handleContinueShopping}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
