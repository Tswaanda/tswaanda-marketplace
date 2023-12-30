import React from "react";
import OrderDetails from "../components/Orders/OrderDetails";
import OrderHistory from "../components/Orders/OrderHistory";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/ContextWrapper";

const Orders = () => {

  const { backendActor, identity } = useAuth();
  const [rawOrders, setRawOrders] = useState(null);
  const [orders, setOrders] = useState(null);

  const getOrders = async () => {
    const res = await backendActor.getMyOrders(identity.getPrincipal());
    const filteredOrders = res.filter((order) => {
      return order.status !== "delivered";
    });
    setRawOrders(filteredOrders);
  };

  useEffect(() => {
    if (identity) {
      getOrders();
    }
  }, [identity]);

  useEffect(() => {
    if (rawOrders) {

      const formatOrderDate = (timestamp: bigint): string => {
        const date = new Date(Number(timestamp));
        const options = { month: "long", day: "numeric", year: "numeric" };
        return date.toLocaleDateString();
      };

      const ordersWithModifiedFields = rawOrders.map((order) => {

        const formattedDate = formatOrderDate(order.dateCreated);

        return {
          ...order,
          step: parseInt(order.step),
          dateCreated: formattedDate,
        };
      });
      setOrders(ordersWithModifiedFields);
    }
  }, [rawOrders]);

  return (
    <div>
      <div className="flex sm:items-baseline sm:space-x-4 justify-end mt-2 mb-2">
        <a
          href="/transactions"
          className="hidden text-sm font-medium text-primary hover:text-secondary sm:block"
        >
          Transaction History
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
      <OrderDetails orders={orders} />
      {/* <OrderHistory /> */}
    </div>
  );
};

export default Orders;
