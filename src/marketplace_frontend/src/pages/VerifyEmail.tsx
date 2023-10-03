import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components";
import { loaderStyle } from "../App";
import { KYCRequest, Result } from "../utils/types";
import { toast } from "react-toastify";
import { useAuth } from "../components/ContextWrapper";

const VerifyEmail = () => {
  const {backendActor } = useAuth();

  const navigate = useNavigate();
  const { userid, uniquestr } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [unmatched, setUnmatched] = useState(false);
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const getRecord = async () => {
      const res: Result = await backendActor.getUnverifiedEmailUser(userid);

      if (res.ok) {
        setLoading(false);
        setRecord(res.ok);
        if (res.ok.hashedUniqueString !== uniquestr) {
          setUnmatched(true);
        }
        if (Date.now() > res.ok.expires) {
          setExpired(true)
        }
      } else {
        setLoading(false);
        setNotFound(true);
      }
    };
    if (userid) {
      getRecord();
    }
  }, [userid]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const userKYCRecord: Result = await backendActor.getKYCRequest(
        record.userPrincipal
      );
      if (userKYCRecord.ok) {
        let userEntry: KYCRequest = userKYCRecord.ok;
        userEntry.isEmailVerified = true;
        await backendActor.updateKYCRequest(userEntry.userId, userEntry);
        await backendActor.removeFromUnverified(userid);
        setVerifying(false);
        toast.success("Success! You email have been verified", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        navigate("/");
      }
    } catch (error) {
      setVerifying(false);
      console.error("Error updating KYC request:", error);
    }
  };

  return (
    <>
      {loading && (
        <div className="min-h-screen" style={loaderStyle}>
          <Loader />
        </div>
      )}
      {record && (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="max-w-md mx-auto px-6 py-11 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Welcome to Tswaanda
            </h2>
            {!unmatched && (
              <p className="text-gray-600 mb-6">
                Please verify your email address to get started and unlock the
                amazing features of Tswaanda.
              </p>
            )}
            {unmatched && (
              <p className="text-gray-600 mb-6">
                Uh-oh! It seems like the verification link you used isn't quite
                right. Make sure you're using the exact link from your email.
              </p>
            )}

            {!unmatched && (
              <button
                onClick={handleVerify}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-400 font-semibold transition duration-300"
              >
                {verifying ? "Verifying..." : " Verify My Email"}
              </button>
            )}
          </div>
        </div>
      )}
      {notFound && (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="max-w-md mx-auto px-6 py-11 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Welcome to Tswaanda
            </h2>
            <p className="text-gray-600 mb-6">
              You have already verified your email or haven't created an account
              yet.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyEmail;
