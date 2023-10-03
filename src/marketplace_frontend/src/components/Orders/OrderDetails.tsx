import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function OrderDetails({orders}) {

  return (
    <>
      {orders?.map((order) => (
        <div key={order.orderId} className="bg-gray-50">
          <div className="mx-auto max-w-2xl pt-16 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
              <div className="flex sm:items-baseline sm:space-x-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Order {order.orderNumber}
                </h1>
                <a
                  href="#"
                  className="hidden text-sm font-medium text-primary hover:text-indigo-500 sm:block"
                >
                  View invoice
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Order placed{" "}
                <time
                  dateTime="2021-03-22"
                  className="font-medium text-gray-900"
                >
                  {order.dateCreated}
                </time>
              </p>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-indigo-500 sm:hidden"
              >
                View invoice
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h2 className="sr-only">Products purchased</h2>

              <div className="space-y-8">            
                  <div
                    key={order.orderProducts.id}
                    className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      <div className="sm:flex lg:col-span-7">
                        <div className="aspect-w-1 aspect-h-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                          <img
                            src={order.orderProducts.image}
                            alt="Product image"
                            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                          />
                        </div>

                        <div className="mt-6 sm:mt-0 sm:ml-6">
                          <h3 className="text-base font-medium text-gray-900">
                            <Link to={`../order.orderProducts/${order.orderProducts.id}`}>
                              {order.orderProducts.name}
                            </Link>
                          </h3>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            ${order.orderProducts.price}
                          </p>
                          <p className="mt-3 text-sm text-gray-500">
                            {order.orderProducts.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 lg:col-span-5 lg:mt-0">
                        <dl className="grid grid-cols-2 gap-x-6 text-sm">
                          <div>
                            <dt className="font-medium text-gray-900">
                              Shipping updates
                            </dt>
                            <dd className="mt-3 space-y-3 text-gray-500">
                              <p>{order.orderProducts.email}</p>
                              <p>{order.orderProducts.phone}</p>
                              <button
                                type="button"
                                className="font-medium text-primary hover:text-indigo-500"
                              >
                                Edit
                              </button>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:p-8">
                      <h4 className="sr-only">Status</h4>
                      <p className="text-sm font-medium text-gray-900">
                        {order.orderProducts.status} on{" "}
                        <time dateTime={order.orderProducts.datetime}>{order.orderProducts.date}</time>
                      </p>
                      <div className="mt-6" aria-hidden="true">
                        <div className="overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `calc((${order.step} * 2 + 1) / 8 * 100%)`,
                            }}
                          />
                        </div>
                        <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                          <div className="text-primary">Order placed</div>
                          <div
                            className={classNames(
                              order.step > 0 ? "text-yellow-500" : "text-primary",
                              "text-center"
                            )}
                          >
                            Processing
                          </div>
                          <div
                            className={classNames(
                              order.step > 1 ? "text-yellow-500" : "text-primary",
                              "text-center"
                            )}
                          >
                            Shipped
                          </div>
                          <div
                            className={classNames(
                              order.step > 2 ? "text-yellow-500" : "text-primary",
                              "text-right"
                            )}
                          >
                            Delivered
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            {/* Billing */}
            <div className="mt-16">
              <h2 className="sr-only">Billing Summary</h2>

              <div className="bg-gray-100 py-6 px-4 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
                  {/* <div>
                    <dt className="font-medium text-gray-900">
                      Billing address
                    </dt>
                    <dd className="mt-3 text-gray-500">
                      <span className="block">Floyd Miles</span>
                      <span className="block">7363 Cynthia Pass</span>
                      <span className="block">Toronto, ON N3Y 4H8</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">
                      Payment information
                    </dt>
                    <dd className="-ml-4 -mt-1 flex flex-wrap">
                      <div className="ml-4 mt-4 flex-shrink-0">
                        <svg
                          aria-hidden="true"
                          width={36}
                          height={24}
                          viewBox="0 0 36 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-auto"
                        >
                          <rect width={36} height={24} rx={4} fill="#224DBA" />
                          <path
                            d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                            fill="#fff"
                          />
                        </svg>
                        <p className="sr-only">Visa</p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-gray-900">Ending with 4242</p>
                        <p className="text-gray-600">Expires 02 / 24</p>
                      </div>
                    </dd>
                  </div> */}
                </dl>

                <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
                  <div className="flex items-center justify-between pb-4">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium text-gray-900">${order.shippingEstimate.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="font-medium text-gray-900">${order.taxEstimate.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <dt className="font-medium text-gray-900">Order total</dt>
                    <dd className="font-medium text-indigo-600">${order.totalPrice.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}