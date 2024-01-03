import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { faqs } from "../constants/index";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FAQs = () => {
  return (
    <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
      <div
        className="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 md:top-20 lg:ml-20 xl:top-3 xl:ml-56"
        aria-hidden="true"
      >
        <div
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ffdf80] to-[#6fed68] opacity-30"
          style={{
            clipPath:
              "polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)",
          }}
        />
      </div>
      <div className="mx-auto px-6 lg:px-8">
        <div className="mx-auto lg:mx-0 mb-10">
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequenty Asked Questions (FAQs)
          </h1>
        </div>
        <div className="divide-y divide-gray-200 border-t">
          <Disclosure as="div">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                    <span
                      className={classNames(
                        open ? "text-green-700" : "text-gray-900",
                        " font-medium"
                      )}
                    >
                      General Queries
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-primary group-hover:text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <ul role="list" className="text-green-500">
                    <li>Product HS Code : </li>
                    <li>
                      <button
                        // onClick={() => navigate("/hscodes")}
                        className="text-gray-500 hover:underline"
                      >
                        {" "}
                        More about HS Codes
                      </button>
                    </li>
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          {/* Shipping Info */}

          <Disclosure as="div">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                    <span
                      className={classNames(
                        open ? "text-green-700" : "text-gray-900",
                        " font-medium"
                      )}
                    >
                      Orders
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-primary group-hover:text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <ul role="list">
                    <li>Shipping will be initiated on down payments,</li>
                    <li>Available for shipping to SA, AU, EU, US, UK</li>
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* Product Reviews */}
          <Disclosure as="div">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                    <span
                      className={classNames(
                        open ? "text-green-700" : "text-gray-900",
                        " font-medium"
                      )}
                    >
                      Dispute Resolution Process
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-primary group-hover:text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  {faqs.disputes.map((dispute) => (
                    <div className="mb-5">
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                        {dispute.q}
                      </h3>
                      <p
                        className="text-gray-700"
                        style={{
                          listStyleType: "lower-roman",
                          marginLeft: "20px",
                        }}
                      >
                        {dispute.a}
                      </p>
                    </div>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
