import React from "react";
import { useParams } from "react-router";

const OrderDetails = () => {
  const { id } = useParams();

  return <div>{id}</div>;
};

export default OrderDetails;
