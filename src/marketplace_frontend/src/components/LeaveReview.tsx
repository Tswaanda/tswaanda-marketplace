import React, { useEffect } from "react";
import { ZodType, z } from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useAuth } from "./ContextWrapper";

type FormData = {
  review: string;
};

interface Response {
  err?: any;
  ok?: any;
}

const LeaveReview = ({ setOpenReviewModal, id, getProductReviews }) => {

  const {identity, backendActor, adminBackendActor} = useAuth();
  const [rating, setRating] = React.useState(0);
  const [userInfo, setUserInfo] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const schema = z.object({
    review: z
      .string()
      .min(10, { message: "Review must be 10 or more characters long" })
      .max(500, { message: "Username must be less than 500 characters long" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (identity)
      (async () => {
        try {
          const res: Response = await backendActor.getKYCRequest(identity.getPrincipal());
          if (res.err) {
            console.log(res.err);
          } else {
            setUserInfo(res.ok);
          }
        } catch (error) {
          console.log(error);
        }
      })();
  }, [identity]);

  const submitReview = async (data: FormData) => {
    if (rating === 0) {
      toast.warning("Please select a rating star", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      return;
    }
    try {
      if (!userInfo) {
        toast.warning("You must be KYC verified to leave a review", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      } else {
        setSubmitting(true);
        const reviewData = {
          id: uuidv4(),
          productId: id,
          userName: userInfo.firstName,
          userLastName: userInfo.lastName,
          rating: BigInt(rating),
          review: data.review,
          created: BigInt(Date.now()),
        };
        await adminBackendActor.addProductReview(reviewData);
        toast.success("Review submitted successfully. Thank you for the feedback", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        setSubmitting(false);
        getProductReviews();
        setOpenReviewModal(false);
      }
    } catch (error) {
      setSubmitting(false);
      console.log(error);
    }
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <form
            onSubmit={handleSubmit(submitReview)}
            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
          >
            <div className="relative p-6 flex-auto">
              <h2 className="text-2xl font-semibold">Leave a review</h2>
              <p className="my-4 text-gray-600 text-lg leading-relaxed">
                Please leave a review for your experience.
              </p>
              <p className="my-4 text-sm text-gray-600 leading-relaxed">
                Pick a star
              </p>
              <div className="flex items-center space-x-3 mb-3">
                <svg
                  onClick={() => setRating(1)}
                  className={`w-8 h-8 hover:cursor-pointer ${
                    rating === 1 ||
                    rating === 2 ||
                    rating === 3 ||
                    rating === 4 ||
                    rating === 5
                      ? `text-yellow-300`
                      : `text-gray-300`
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  onClick={() => setRating(2)}
                  className={`w-8 h-8 hover:cursor-pointer ${
                    rating === 2 || rating === 3 || rating === 4 || rating === 5
                      ? `text-yellow-300`
                      : `text-gray-300`
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  onClick={() => setRating(3)}
                  className={`w-8 h-8 hover:cursor-pointer ${
                    rating === 3 || rating === 4 || rating === 5
                      ? `text-yellow-300`
                      : `text-gray-300`
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  onClick={() => setRating(4)}
                  className={`w-8 h-8 hover:cursor-pointer ${
                    rating === 4 || rating === 5
                      ? `text-yellow-300`
                      : `text-gray-300`
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <svg
                  onClick={() => setRating(5)}
                  className={`w-8 h-8 hover:cursor-pointer ${
                    rating === 5 ? `text-yellow-300` : `text-gray-300`
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-bold mb-2">
                  Review
                </label>
                <textarea
                  className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={5}
                  {...register("review")}
                  placeholder="Type your review"
                ></textarea>
                {errors.review && (
                  <span className="text-red-400 text-sm">
                    {errors.review.message}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons  */}

            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenReviewModal(false);
                }}
              >
                Close
              </button>

              <button
                className={`${
                  submitting ? `bg-gray-500` : `bg-emerald-500`
                } text-white  font-semibold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                type="submit"
              >
                {submitting ? `Submitting review...` : `Submit`}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default LeaveReview;
