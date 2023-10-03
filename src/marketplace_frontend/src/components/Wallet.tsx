import React, { useEffect, useState } from "react";
import Big from "big.js";
import { toast } from "react-toastify";
import { PlusIcon } from '@heroicons/react/20/solid'

const Wallet = () => {
  const [user, setUser] = useState(null);
  const [configData, setConfig] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [usdval, setUSDVal] = useState(null);

  const [draw, setDraw] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [metadata, setMetadata] = useState(null);
  const [tokenBal, setBal] = useState(null);

  const [newAcc, setNewAcc] = useState("");
  const [register, setRegister] = useState(true);

  const [transferAcc, setTransferAcc] = useState("");
  const [transferAmnt, setTranferAmnt] = useState(null);
  const [memo, setMemo] = useState("");
  const [transfer, setTransfer] = useState(true);

  const handleUser = (e) => {
    if (user && e.target.textContent === "Remove Wallet") {
      (function signOut() {
        wallet.signOut();
        window.location.replace(
          window.location.origin + window.location.pathname
        );
      })();
    } else if (!user && e.target.textContent === "Connect NEAR Wallet") {
      (function signIn() {
        wallet.requestSignIn(configData.contractName, "Wallet Block Dice");
      })();
    }
  };

  const loadUserInfo = async () => {
    let bal = await contract.ft_balance_of({ account_id: user.accountId });
    if (bal > 0) {
      const formattedBal = bal / 1000000000000000000000000;
      const roundedBal = formattedBal.toFixed(2);
      setUSDVal(roundedBal);
      setBal(formattedBal);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserInfo();
    }
  }, [user]);

  const gas = Big(3)
    .times(10 ** 13)
    .toFixed();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (newAcc != "") {
      try {
        const result = await contract.storage_deposit(
          { account_id: newAcc },
          gas,
          "1250000000000000000000"
        );
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (transferAcc != "" && transferAmnt) {
      try {
        const amount = Big(transferAmnt)
          .times(10 ** 24)
          .toFixed();
        const res = await contract.ft_transfer(
          { receiver_id: transferAcc, amount: amount, memo: memo },
          gas,
          1
        );
        toast.success("Transfer successful", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        console.log("this is the res", res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleWithdrawToken = async (e) => {
    e.preventDefault();
    toast.success(
      `${withdrawAmount} USD has been successfully withdrawn into your bank account`,
      {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      }
    );
    setDraw(true);
    setWithdrawAmount("");
  };
  const handleDrawCancel = () => {
    setWithdrawAmount("");
    setDraw(true);
  };
  const handleCancelTransfer = () => {
    setTransfer(true);
    setTranferAmnt(null);
    setTransferAcc("");
    setMemo("");
  };

  const handleCancelRegister = () => {
    setNewAcc("");
    setRegister(true);
  };

  return (
    <div>
      {!user && (
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Connected Wallet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by connecting your wallet.</p>
          <div className="mt-6">
            <button
              type="button"
              // onClick={handleUser}
              className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="md:min-w-[600px]">
          <div className="rounded-lg p-2 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">@{user.accountId}</h3>
              <div className=" flex items-center">
                <img
                  className="h-10 w-10 rounded-full"
                  src="./tokenlogo.png"
                  alt="token logo"
                />
                <h3 className="font-semibold text-lg text-gray-600">
                  TSWAANDA
                </h3>
              </div>
            </div>
            <div className="pt-5 flex justify-between items-center">
              <div className="">
                <h3 className="font-bold">
                  <span className="text-2xl">{tokenBal}</span> TSWT
                </h3>
                <h3 className="font-bold text-lg text-gray-600">
                  ≈ {usdval} USD
                </h3>
              </div>
              <button onClick={handleUser} className="hover:cursor-pointer px-4 py-1.5 font-semibold leading-7 border border-gray-600 rounded-lg hover:border-primary">
                Remove Wallet
              </button>
            </div>
          </div>

          <div className="border mt-5 rounded-lg p-2 bg-white">
            <div className="flex justify-between items-center ">
              <h3 className="font-bold">Send</h3>
              <button
                onClick={() => setTransfer(false)}
                className={` ${
                  transfer ? `block` : `hidden`
                } inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white hover:text-primary shadow-sm ring-1 ring-primary hover:bg-white hover:ring-primary`}
              >
                Transfer
              </button>
            </div>
            <form
              hidden={transfer}
              className="gap-3 mt-3"
              onSubmit={handleTransfer}
            >
              <div className="flex flex-col">
                <h3 className="font-semibold">Receiver</h3>
                <input
                  type="text"
                  className="block mt-2 w-full rounded-md border-0 py-3 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white"
                  placeholder="Recipient's address"
                  value={transferAcc}
                  onChange={(e) => setTransferAcc(e.target.value)}
                />
                <h3 className="font-semibold">Amount</h3>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-3 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="0.00"
                    value={transferAmnt}
                    onChange={(e) => setTranferAmnt(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>USD</option>
                      <option>TSWT</option>
                      <option>NEAR</option>
                    </select>
                  </div>
                </div>
                <h3 className="font-semibold mt-3">
                  Memo (Optional)
                </h3>
                <input
                  type="text"
                  className="block w-full mt-2 rounded-md border-0 py-3 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white"
                  placeholder="Gift"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
                <div className="flex justify-center items-center gap-3 pt-3">
                  <h3
                    onClick={handleCancelTransfer}
                    className="hover:cursor-pointer px-4 py-1.5 font-semibold leading-7 border border-gray-600 rounded-lg hover:border-primary"
                  >
                    Cancel
                  </h3>
                  <button
                    className="inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white hover:text-primary shadow-sm ring-1 ring-primary hover:bg-white hover:ring-primary"
                    type="submit"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white mt-5 p-2 rounded-lg border">
            <div className="flex justify-between items-center ">
              <h3 className="font-semibold">Withdraw</h3>
              <button
                onClick={() => setDraw(false)}
                className={` ${
                  draw ? `block` : `hidden`
                } inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white hover:text-primary shadow-sm ring-1 ring-primary hover:bg-white hover:ring-primary`}
              >
                Withdraw
              </button>
            </div>
            <form hidden={draw} onSubmit={handleWithdrawToken} className="py-2">
              <h3>Amount</h3>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-3 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                    placeholder="0.00"
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>USD</option>
                      <option>TSWT</option>
                      <option>NEAR</option>
                    </select>
                  </div>
                </div>
              <div className="flex justify-center items-center gap-3 pt-3">
                <h3
                  onClick={handleDrawCancel}
                  className="hover:cursor-pointer px-4 py-1.5 font-semibold leading-7 border border-gray-600 rounded-lg hover:border-primary"
                >
                  Cancel
                </h3>
                <button
                  className="inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white hover:text-primary shadow-sm ring-1 ring-primary hover:bg-white hover:ring-primary"
                  type="submit"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white mt-5 p-2 rounded-lg border">
            <div className="flex gap-5 justify-between items-center ">
              <div className="max-w-[600px]">
                <h3 className="text-sm">
                  Want to send some Tswaanda tokens to someone who is not a
                  Tswaanda customer? Register them here at a small storage fee
                  of only 0.00125 NEAR, less than $0.01 USD.{" "}
                  <span className="underline">Find out more</span>
                </h3>
              </div>
              <button
                onClick={() => setRegister(false)}
                className={` ${
                  register ? `block` : `hidden`
                } inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white hover:text-primary shadow-sm ring-1 ring-primary hover:bg-white hover:ring-primary`}
              >
                Register
              </button>
            </div>
            <form
              hidden={register}
              onSubmit={handleRegister}
              className=" gap-3"
            >
              <div className="flex flex-col">
                <input
                    type="text"
                    className="block mt-2 w-full rounded-md border-0 py-3 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white"
                    placeholder="Recipient's address"
                    value={newAcc}
                    onChange={(e) => setNewAcc(e.target.value)}
                  />
                <div className="flex justify-center items-center gap-3 pt-3">
                  <h3
                    onClick={handleCancelRegister}
                    className="hover:cursor-pointer px-4 py-1.5 font-semibold leading-7 border border-gray-600 rounded-lg hover:border-primary"
                  >
                    Cancel
                  </h3>
                  <button
                    className="inline-block rounded-lg bg-primary px-4 py-1.5 text-base font-semibold leading-7 text-white hover:text-primary shadow-sm ring-1 ring-primary hover:bg-white hover:ring-primary"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
