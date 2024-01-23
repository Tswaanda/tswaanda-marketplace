import OrderHistory from "./components/OrderHistory";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/ContextWrapper";
import { TbShoppingCartCheck } from "react-icons/tb";
import { FaFileInvoice } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { MdOutlinePendingActions } from "react-icons/md";
import OrdersList from "./components/OrdersList";
import Transactions from "./components/Transactions";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const subNavigation = [
  { name: "Orders", icon: TbShoppingCartCheck },
  { name: "Invoices", icon: FaFileInvoice },
  { name: "Pending Payments", icon: MdOutlinePendingActions },
  { name: "Transactions History", icon: GrTransaction },
];

const Orders = () => {
  const { backendActor, identity } = useAuth();
  const [rawOrders, setRawOrders] = useState(null);
  const [orders, setOrders] = useState(null);
  const [activeInfo, setActiveInfo] = useState("Orders");

  const getOrders = async () => {
    const res = await backendActor.getMyOrders(identity.getPrincipal());
    const filteredOrders = res.filter((order) => {
      return (
        JSON.stringify(order.orderStage) !== JSON.stringify({ delivered: null })
      );
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
    <div className="h-full">
      <main className="mx-auto max-w-7xl pb-10 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1">
              {subNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveInfo(item.name)}
                  className={classNames(
                    activeInfo === item.name
                      ? "bg-gray-50 text-primary hover:bg-white"
                      : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                    "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                  )}
                  aria-current={item.name === activeInfo ? "page" : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.name === activeInfo
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-gray-500",
                      "flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-xs"
                    )}
                    size={20}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Orders */}
          {activeInfo === "Orders" && (
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
              <OrdersList activate={setActiveInfo} />
            </div>
          )}

          {/* Invoices */}
          {activeInfo === "Invoices" && (
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
              <h3 className="flex justify-center items-center">Coming Soon</h3>
            </div>
          )}

          {/* Transactions */}
          {activeInfo === "Transactions" && (
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
              <h3 className="flex justify-center items-center">Coming Soon</h3>
            </div>
          )}

          {/* Pending Payments */}
          {activeInfo === "Pending Payments" && (
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
              <h3 className="flex justify-center items-center">Coming Soon</h3>
            </div>
          )}

          {/* Orders History */}
          {activeInfo === "Transactions History" && (
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
              <Transactions />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
