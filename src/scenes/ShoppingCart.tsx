import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { XMarkIcon as XMarkIconOutline } from "@heroicons/react/24/outline";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import { GroundNuts } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { Loader } from "../components";
import { useAuth } from "../hooks/ContextWrapper";
import { sendOrderPlacedEmail } from "../utils/emails/orderPlacedUpdate";
import {
  Customer,
  ProductOrder,
} from "../declarations/marketplace_backend/marketplace_backend.did";
import { getStatus } from "../hooks/wsUtils";
import {
  AdminNotification,
  AppMessage,
  FromMarketMessage,
  MarketOrderUpdate,
} from "../declarations/tswaanda_backend/tswaanda_backend.did";

const navigation = {
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
  ],
};

// let product = {
//   id: "SB-001",
//   name: "Smart Basil",
//   hscode: "1234.56.78",
//   farmer: "TechGreens",
//   price: 500,
//   minOrder: 10,
//   shortDescription: "AI-enhanced, blockchain-tracked basil plant",
//   fullDescription: "Smart Basil is the first of its kind: an AI-enhanced, blockchain-tracked basil plant. Grown in a tech-optimized environment, it's designed for both cooking enthusiasts and tech geeks. Each leaf is monitored for optimal growth, and its blockchain integration allows you to track its journey from seed to your kitchen.",
//   category: "Tech-Enhanced Edibles",
//   images: ["smart_basil1.jpg", "smart_basil2.jpg"],
//   weight: 200,
//   ordersPlaced: 0,
//   availability: "Pre-order",
//   created: 20240112
// };

const relatedProducts = [
  {
    id: 1,
    name: "Ground Nutties",
    href: "#",
    imageSrc: GroundNuts,
    imageAlt: "Ground nutties",
    price: "$118",
    color: "Natural",
  },
  // More products...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ShoppingCart() {
  const { backendActor, adminBackendActor, identity, ws } = useAuth();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<Customer | null>(null);
  const [isAnon, setIsAnon] = useState(false);
  const [cartRawProduct, setRawProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);

  interface Response {
    err?: any;
    ok?: any;
  }
  const getCartItems = async () => {
    const res: Response = await backendActor.getMyCartItem(
      identity.getPrincipal()
    );
    if (res.ok) {
      setCartItem(res.ok);
    } else if (res.err) {
      setLoading(false);
      console.log(res.err);
    }
  };

  const getUserDetails = async () => {
    const res: Response = await backendActor.getKYCRequest(
      identity.getPrincipal()
    );
    if (res.err) {
      setIsAnon(true);
    } else if (res.ok) {
      if (res.ok.body.length === 0) {
        setIsAnon(true);
      } else {
        setUserInfo(res.ok);
      }
    }
  };

  useEffect(() => {
    if (identity && adminBackendActor) {
      getCartItems();
      getUserDetails();
    }
  }, [identity, adminBackendActor]);

  useEffect(() => {
    if (cartItem) {
      getProduct(cartItem.id);
    }
  }, [cartItem]);

  const getProduct = async (id) => {
    const res: Response = await adminBackendActor.getProductById(id);
    if (res.ok) {
      setProduct(res.ok);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // Removing a product from the cartItems array and from the backend as well

  const handleRemove = async () => {
    setCartItem(null);
    setProduct(null);
    await backendActor.removeFromCart(identity.getPrincipal());
  };

  //----------------------------------Order summary calculations-------------------------------------------------------
  const handleQuantityChange = (e, id: String) => {
    const newQty = e.target.value;

    if (cartItem.id === id) {
      const updatedCartItem = {
        ...cartItem,
        quantity: newQty,
      };
      setCartItem(updatedCartItem);
    }
  };

  const [subtotal, setSubtotal] = useState(null);
  const [shippingEstimate, setShipEstimate] = useState(null);
  const [taxEstimate, setTax] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const shippingPercentage = 0.05;
  const taxPercentage = 0.1;

  useEffect(() => {
    if (product && cartItem) {
      setCalculating(true);
      const subtotal = Number(product.price) * Number(cartItem.quantity);
      setSubtotal(subtotal);
    }
  }, [product, cartItem]);

  useEffect(() => {
    if (subtotal) {
      const shipping = subtotal * shippingPercentage;
      const tax = subtotal * taxPercentage;
      const total = subtotal + shipping + tax;

      setShipEstimate(shipping.toFixed(2));
      setTax(tax.toFixed(2));
      setOrderTotal(total.toFixed(2));
      setCalculating(false);
    }
  }, [subtotal]);

  function getCartItemQuantity(productId) {
    return cartItem ? Number(cartItem.quantity) : 0;
  }

  // ----------------------------------------Creating Order----------------------------------------------------------

  const createMyOrder = async (e) => {
    e.preventDefault();
    setCreatingOrder(true);
    try {
      if (isAnon) {
        toast.warning(
          "Please create a Tswaanda profile to proceed with your order",
          {
            autoClose: 10000,
            position: "top-center",
            hideProgressBar: true,
          }
        );

        navigate("/account");
        setCreatingOrder(false);
      } else {
        const date = new Date();
        const timestamp = date.getTime();
        const lastDigits = timestamp.toString().slice(-8);
        const randomLetters = generateRandomLetters(3);

        const orderProduct = {
          id: cartItem.id,
          name: product.name,
          description: product.fullDescription,
          price: parseFloat(product.price),
          image: product.images[0],
          quantity: BigInt(cartItem.quantity),
        };
        const order: ProductOrder = {
          orderId: String(uuidv4()),
          orderNumber: `TSWA-${lastDigits}${randomLetters}`,
          orderProducts: orderProduct,
          userEmail: userInfo?.body[0].email,
          orderOwner: identity.getPrincipal(),
          subtotal: parseFloat(subtotal),
          totalPrice: parseFloat(orderTotal),
          shippingEstimate: parseFloat(shippingEstimate),
          taxEstimate: parseFloat(taxEstimate),
          invoicePDF: "",
          invoiceTitle: "Invoice",
          productLineQuantityAmount: String(product.price),
          exportDocsVerified: false,
          shipmentDocsVerified: false,
          subTotalLabel: "Subtotal",
          invoiceDueDate: "Due on receipt",
          clientName: userInfo?.body[0].firstName,
          termLabel: "Terms",
          name: product.name,
          companyAddress2: "P.O. Box 12345",
          invoiceDateLabel: "Invoice date",
          exportDocs: [],
          companyCountry: "Zimbabwe",
          clientAddress2: "123 Main St.",
          notesLabel: "Notes",
          clientAddress: "New York, NY, 10001",
          totalLabel: "Total",
          invoiceDate: "2021-08-25",
          productLines: {
            rate: String(product.price),
            description: product.fullDescription,
            quantity: String(cartItem.quantity),
          },
          currency: "USD",
          notes: "Thank you for your business.",
          productLineQuantityRate: String(product.price),
          companyName: "Tswaanda",
          taxLabel: "Tax",
          productLineQuantity: String(cartItem.quantity),
          invoiceTitleLabel: "Invoice",
          orderStage: { orderplaced: null },
          shipmentDocs: [],
          invoiceDueDateLabel: "Due date",
          companyAddress: "123 Fake St.",
          clientCountry: "United States",
          invoiceStatus: { unpaid: null },
          billTo: "Bill to",
          productLineDescription: product.fullDescription,
          created: BigInt(timestamp),
        };
        const res = await makeUpdates(product);
        if (!res) {
          toast.error("Error when placing order", {
            autoClose: 10000,
            position: "top-center",
            hideProgressBar: true,
          });
          setCreatingOrder(false);
          return;
        }
        await backendActor.createOrder(order);
        sendOrderUpdateWSMessage(order.orderId);
        await backendActor.removeFromCart(identity.getPrincipal());
        toast.success(
          "Order successfully created. Head over to the orders page to track your order's progress.",
          {
            autoClose: 10000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        setCreatingOrder(false);
        navigate(`/order/${order.orderId}`);
      }
    } catch (error) {
      console.log("Error when placing order", error);
      setCreatingOrder(false);
    }
  };

  function generateRandomLetters(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const makeUpdates = async (product: any) => {
    let farmerRes: Response = await backendActor.getFarmerByEmail(
      product.farmer
    );
    console.log("Farmer res", farmerRes, product.farmer);
    if (farmerRes.ok) {
      try {
        let updatedProduct = {
          ...product,
          ordersPlaced: product.ordersPlaced + 1,
        };
        await adminBackendActor.updateProduct(
          updatedProduct.id,
          updatedProduct
        );
        await sendOrderPlacedEmail(farmerRes.ok, product);
        return true;
      } catch (error) {
        console.log("Error when making updates", error);
      }
    }
  };

  const sendOrderUpdateWSMessage = async (id: string) => {
    let message = getStatus("order_placed");
    if (identity) {
      const msg: AppMessage = {
        FromMarket: {
          OrderUpdate: {
            message: message.message,
          },
        },
      };
      let notification: AdminNotification = {
        id: uuidv4(),
        notification: {
          OrderUpdate: {
            marketPlUserclientId: identity.getPrincipal().toString(),
            orderId: id,
            message: message.message,
          },
        },
        read: false,
        created: BigInt(Date.now()),
      };
      await adminBackendActor.createAdminNotification(notification);
      ws.send(msg);
    } else {
      console.log("Identity not found");
    }
  };

  return (
    <div className="bg-white">
      {!product && loading && (
        <div className="flex justify-center items-center px-7 lg:px-28 pt-8 pb-10 h-[70vh]">
          <Loader />
        </div>
      )}
      {!product && !loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <h2 className="text-2xl mb-16 font-bold tracking-tight text-primary">
            Nothing to see for now, your cart is empty!
          </h2>
        </div>
      ) : (
        <>
          {/* Mobile menu */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                    <div className="flex px-4 pt-5 pb-2">
                      <button
                        type="button"
                        className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIconOutline
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                      {navigation.pages.map((page) => (
                        <div key={page.name} className="flow-root">
                          <a
                            href={page.href}
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            {page.name}
                          </a>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                      <div className="flow-root">
                        <a
                          href="#"
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Sign in
                        </a>
                      </div>
                      <div className="flow-root">
                        <a
                          href="#"
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Create account
                        </a>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4">
                      <a href="#" className="-m-2 flex items-center p-2">
                        <img
                          src="https://tailwindui.com/img/flags/flag-canada.svg"
                          alt=""
                          className="block h-auto w-5 flex-shrink-0"
                        />
                        <span className="ml-3 block text-base font-medium text-gray-900">
                          CAD
                        </span>
                        <span className="sr-only">, change currency</span>
                      </a>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Shopping Cart
            </h1>

            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>
                {/* {products?.length === 0 && (
              <div className="">
                <h1>Your cart is empty</h1>
              </div>
            )} */}
                <ul
                  role="list"
                  className="divide-y divide-gray-200 border-t border-b border-gray-200"
                >
                  {/* {products?.map((product, product.id) => ( */}
                  <>
                    {product && (
                      <li key={product.id} className="flex py-6 sm:py-10">
                        <Link to={`../product/${product.id}`}>
                          <div className="flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt="Product image"
                              className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                          </div>
                        </Link>
                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link
                                    to={`../product/${product.id}`}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                  >
                                    {product.name}
                                  </Link>
                                </h3>
                              </div>
                              <div className="mt-1 flex text-sm">
                                {product.size ? (
                                  <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                    {product.size}
                                  </p>
                                ) : null}
                              </div>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                $ {product.price}
                              </p>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:pr-9">
                              <label
                                htmlFor={`quantity-${product.id}`}
                                className="sr-only"
                              >
                                Quantity, {product.name}
                              </label>
                              <select
                                id={`quantity-${product.id}`}
                                name={`quantity-${product.id}`}
                                value={getCartItemQuantity(product.id)}
                                onChange={(e) =>
                                  handleQuantityChange(e, product.id)
                                }
                                className="max-w-full bg-white rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                              </select>

                              <div className="absolute top-0 right-0">
                                <button
                                  type="button"
                                  // onClick={() => handleRemove(product.id)}
                                  onClick={handleRemove}
                                  className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                >
                                  <span className="sr-only">Remove</span>
                                  <XMarkIconMini
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                            {product?.inStock ? (
                              <CheckIcon
                                className="h-5 w-5 flex-shrink-0 text-green-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <ClockIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-300"
                                aria-hidden="true"
                              />
                            )}

                            <span>
                              {product?.inStock
                                ? "In stock"
                                : `Ships in ${product.leadTime}`}
                            </span>
                          </p>
                        </div>
                      </li>
                    )}
                  </>
                  {/* ))} */}
                </ul>
              </section>

              {/* Order summary */}

              <section
                aria-labelledby="summary-heading"
                className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
              >
                <h2
                  id="summary-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Order summary
                </h2>

                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${subtotal?.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>Shipping estimate</span>
                      <a
                        href="#"
                        className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">
                          Learn more about how shipping is calculated
                        </span>
                        <QuestionMarkCircleIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </a>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${shippingEstimate}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex text-sm text-gray-600">
                      <span>Tax estimate</span>
                      <a
                        href="#"
                        className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">
                          Learn more about how tax is calculated
                        </span>
                        <QuestionMarkCircleIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </a>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${taxEstimate}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">
                      Order total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ${orderTotal}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    onClick={createMyOrder}
                    className="w-full rounded-md border border-transparent bg-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    {creatingOrder ? "Creating order..." : "Place Order"}
                  </button>
                </div>
              </section>
            </div>

            {/* Related products */}
            <section aria-labelledby="related-heading" className="mt-24">
              <h2
                id="related-heading"
                className="text-lg font-medium text-gray-900"
              >
                You may also like&hellip;
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="group relative">
                    <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:aspect-none lg:h-80">
                      <img
                        src={relatedProduct.imageSrc}
                        alt={relatedProduct.imageAlt}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <a href={relatedProduct.href}>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {relatedProduct.name}
                          </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {relatedProduct.color}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {relatedProduct.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
}
