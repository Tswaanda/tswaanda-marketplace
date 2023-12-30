import React from "react";

const Subscribed = ({
  subNVerified,
  subNUnverified,
  setSubed,
  resendEmail,
}) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              {subNVerified && (
                <p className="my-4 text-xl text-slate-500 leading-relaxed">
                  Seems like you're really excited about staying in the loop
                  with us! We've got you covered, your email address is already
                  subscribed to our newsletter.
                </p>
              )}
              {subNUnverified && (
                <p className="my-4 text-xl text-slate-500 leading-relaxed">
                  Your email address have already sent a subscription request
                  but it's not verified yet. Check your email and use the link
                  to verify or we can resend the link
                </p>
              )}
            </div>

            {/* Action buttons  */}

            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setSubed(false)}
              >
                Close
              </button>
              {subNUnverified && (
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={resendEmail}
                >
                  Resend link
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Subscribed;
