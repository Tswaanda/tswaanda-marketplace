import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../hooks/ContextWrapper";
import {
  ProductOrder,
  Result_1,
} from "../../declarations/marketplace_backend/marketplace_backend.did";
import IFrame from "./components/IFrame";
import { OrderStage } from "./types/types";

const OrderDetails = () => {
  const { backendActor } = useAuth();
  const { id } = useParams();
  const [order, setOrder] = useState<ProductOrder | null>(null);
  const [orderStage, setOrderStage] = useState<OrderStage>("orderplaced");

  useEffect(() => {
    if (backendActor) {
      getOrder();
    }
  }, [backendActor]);

  const getOrder = async () => {
    const order: Result_1 = await backendActor.getOrder(id);
    if ("ok" in order) {
      setOrder(order.ok);
    } else {
      console.log("Error getting order", order.err);
    }
  };

  useEffect(() => {
    // if (order) {
    //   if (JSON.stringify(order.orderStage) === JSON.stringify({delivered : null})) {
    //     setOrderStage("orderplaced");
    //   } else if (JSON.stringify(order.orderStage) === JSON.stringify({purchased : null}))
    //     setOrderStage("orderaccepted");
    //   } else if (order.status === "orderrejected") {
    //     setOrderStage("orderrejected");
    //   } else if (order.status === "orderfulfilled") {
    //     setOrderStage("orderfulfilled");
    //   }
  }, [order]);

  return (
    <div>
      <IFrame />
    </div>
  );
};

export default OrderDetails;
