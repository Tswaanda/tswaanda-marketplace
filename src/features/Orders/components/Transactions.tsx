import { useEffect, useState } from "react";
import { Brocoli } from "../../../assets/assets";
import { useAuth } from "../../../hooks/ContextWrapper";
import { ProductOrder } from "../../../declarations/marketplace_backend/marketplace_backend.did";

const Transactions = () => {
  const { backendActor } = useAuth();
  const [orders, setOrders] = useState<ProductOrder[] | null>(null);

  useEffect(() => {
    getDeliveredOrders();
  }, []);

  const getDeliveredOrders = async () => {
    const orders: ProductOrder[] = await backendActor.getDeliveredOrders();
    setOrders(orders);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Transactions history
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and download
            invoices.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="sr-only">Recent orders</h2>

          <div className="space-y-20">
            {orders?.map((order) => (
              <div key={order.orderId}>
                <h3 className="sr-only">
                  Order placed on <time></time>
                </h3>

                {/* <div className="rounded-lg bg-gray-50 py-6 px-4 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                  <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                    <div className="flex justify-between sm:block">
                      <dt className="font-medium text-gray-900">Date placed</dt>
                      <dd className="sm:mt-1">
                        <time dateTime={order.datetime}>{order.date}</time>
                      </dd>
                    </div>
                    <div className="flex justify-between pt-6 sm:block sm:pt-0">
                      <dt className="font-medium text-gray-900">Order number</dt>
                      <dd className="sm:mt-1">{order.number}</dd>
                    </div>
                    <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                      <dt>Total amount</dt>
                      <dd className="sm:mt-1">{order.total}</dd>
                    </div>
                  </dl>
                  <a
                    href={order.invoiceHref}
                    className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                  >
                    View Invoice
                    <span className="sr-only">for order {order.number}</span>
                  </a>
                </div> */}

                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                  <caption className="sr-only">Products</caption>
                  <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="hidden py-3 pr-8 font-normal sm:table-cell"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="w-0 py-3 text-right font-normal"
                      >
                        <button>More Info</button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                    {/* {order.orderProducts.map((product) => ( */}
                      <tr >
                        <td className="py-6 pr-8">
                          <div className="flex items-center">
                            <img
                              src={order.orderProducts.image}
                              className="mr-6 h-16 w-16 rounded object-cover object-center"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.orderProducts.name}
                              </div>
                              <div className="mt-1 sm:hidden">
                               $ {order.orderProducts.price}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-6 pr-8 sm:table-cell">
                         $ {order.orderProducts.price}
                        </td>
                        <td className="hidden py-6 pr-8 sm:table-cell">
                          {order.status}
                        </td>
                        <td className="whitespace-nowrap py-6 text-right font-medium">
                          <a href="#" className="text-primary">
                            Download
                            <span className="hidden lg:inline"> Receipt</span>
                            <span className="sr-only">, {order.orderProducts.name}</span>
                          </a>
                        </td>
                      </tr>
                    {/* ))} */}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
