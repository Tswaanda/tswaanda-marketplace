import React from "react";
import OrderDetails from "../components/Orders/OrderDetails";
import OrderHistory from "../components/Orders/OrderHistory";
import { useEffect, useState } from "react";
import { useAuth } from "../components/ContextWrapper";

const Orders = () => {

  const { backendActor, identity } = useAuth();
  const [rawOrders, setRawOrders] = useState(null);
  const [orders, setOrders] = useState(null);

  const getOrders = async () => {
    const res = await backendActor.getMyOrders(identity.getPrincipal());
    setRawOrders(res);
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
      <OrderDetails orders={orders} />
      {/* <OrderHistory /> */}
    </div>
  );
};

export default Orders;
