import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/ContextWrapper";
import { Customer } from "../declarations/marketplace_backend/marketplace_backend.did";
import { v4 as uuid } from "uuid";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router";

export default function KYCModal({ show, onClose }) {
  const navigate = useNavigate();
  const { backendActor, identity } = useAuth();
  const [loading, setLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  const handleContineAnon = async () => {
    try {
      setLoading(true);
      const anonUser: Customer = {
        id: uuid(),
        principal: identity.getPrincipal(),
        body: [],
        created: BigInt(Date.now()),
      };

      await backendActor.createKYCRequest(anonUser);
      setLoading(false);
      onClose();
    } catch (error) {
      console.log("Error when saving anon user info", error);
      setLoading(false);
    }
  };

  const handleCompleteKYC = async () => {
    onClose();
    navigate("/account");
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <InformationCircleIcon
                      className="h-6 w-6 text-orange-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Ready to order?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Submit your KYC or continue to browse anonymously.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
                    onClick={handleCompleteKYC}
                  >
                    Complete KYC
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm  ring-inset  hover:bg-secondary sm:col-start-1 sm:mt-0"
                    onClick={handleContineAnon}
                  >
                    {loading ? (
                      <ThreeCircles
                        height="20"
                        width="20"
                        color="#4fa94d"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="three-circles-rotating"
                        outerCircleColor=""
                        innerCircleColor=""
                        middleCircleColor=""
                      />
                    ) : (
                      "Continue Anon"
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
