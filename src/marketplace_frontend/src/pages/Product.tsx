import { useEffect, useState } from "react";
import { Disclosure, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LeaveReview from "../components/LeaveReview";
import ToolTip from "../components/ToolTip";
import { useAuth } from "../components/ContextWrapper";
import { ThreeCircles } from "react-loader-spinner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Review = {
  id: string;
  productId: string;
  userName: string;
  userLastName: string;
  rating: bigint;
  review: string;
  created: bigint;
};

export default function Product() {
  const { backendActor, adminBackendActor, identity, setFavouritesUpdated } = useAuth();

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [addingtocart, setAddingToCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ratevalue, setRateValue] = useState(0);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [addingtoFav, setAddingToFav] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);

  interface Response {
    err?: any;
    ok?: any;
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      const getProduct = async () => {
        const result: Response = await adminBackendActor.getProductById(id);
        if (result.ok) {
          setProduct(result.ok);
          setLoading(false);
        } else {
          console.log(result.err);
        }
      };
      getProduct();
    }
  }, [id]);

  const getCartItems = async () => {
    const res: Response = await backendActor.getMyCartItem(
      identity?.getPrincipal()
    );
    if (res.ok) {
      setCartItem(res.ok);
    } else {
      setChecking(false);
    }
    setAddingToCart(false);
  };

  const checkIsFavourite = async () => {
    const res = await backendActor.isProductFavoutite(id);
    if (res) {
      setIsFavourite(true);
    }
  };

  useEffect(() => {
    if (identity) {
      getCartItems();
      checkIsFavourite();
    } else {
      setChecking(false);
    }
  }, [identity]);

  useEffect(() => {
    if (cartItem) {
      if (cartItem.id === id) {
        setInCart(true);
      }
      setChecking(false);
    }
  }, [cartItem]);

  const handleAddToCart = async () => {
    if (cartItem && !checking) {
      toast.warning(
        "Sorry, you can only have one product in the cart at a time",
        {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        }
      );
    } else {
      if (identity && id && !checking && !inCart) {
        setAddingToCart(true);
        const date = new Date();
        const timestamp = date.getTime();
        const cartItem = {
          id: id,
          quantity: 1,
          dateCreated: timestamp,
        };
        const res = await backendActor.addToCart(
          identity?.getPrincipal(),
          cartItem
        );
        getCartItems();
      } else if (identity === null) {
        toast.warning("You are not logged in", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      } else {
        console.log("Checking");
      }
    }
  };

  const handleGoToCart = () => {
    navigate("/shopping-cart");
  };

  const handleLeaveReview = () => {
    if (!identity) {
      toast.warning("Please login first to leave a review", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
    } else {
      setOpenReviewModal(true);
    }
  };

  const getProductReviews = async () => {
    const res = await adminBackendActor.getProductReviews(id);
    if (Array.isArray(res)) {
      const sortedReviews = res.sort(
        (b: Review, a: Review) => Number(a.rating) - Number(b.rating)
      );
      setReviews(sortedReviews);
    }
  };

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    handleScrollToTop();
    getProductReviews();
  }, []);

  const formatOrderDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp));
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString();
  };

  const calculateAverageRating = (reviews: any) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((accumulator: number, review: any) => {
      return accumulator + Number(review.rating);
    }, 0);
    const averageRating = totalRating / reviews.length;

    const roundedAverage = Math.round(averageRating * 10) / 10;

    return roundedAverage;
  };

  const ratingValue = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((accumulator, review) => {
      return accumulator + Number(review.rating);
    }, 0);

    const averageRating = totalRating / reviews.length;

    const roundedAverage = Math.round(averageRating);

    setRateValue(roundedAverage);
  };

  useEffect(() => {
    ratingValue(reviews);
  }, [reviews]);

  // Add to favourites

  const addToFavourites = async () => {
    try {
      if (!identity?.getPrincipal()) {
        toast.warning("Please login first to add to favourites", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      } else {
        setAddingToFav(true);
        const res = await backendActor.addToFavourites(id);
        if (res) {
          toast.success("Added to favourites!", {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          });
        }
        setFavouritesUpdated(true);
        setIsFavourite(true);
        setAddingToFav(false);
      }
    } catch (error) {
      console.log(error);
      setAddingToFav(false);
    }
  };

  return (
    <div className="bg-white">
      {!loading && (
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {product?.images.map((image, index) => (
                    <Tab
                      key={index}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                {product?.images.map((image, index) => (
                  <Tab.Panel key={index}>
                    <img
                      src={image}
                      alt="product image"
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product?.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  $ {product?.price} per tonne
                </p>
                <div className="my-4 text-gray-600">
                  <h1>
                    Minimum order:{" "}
                    <span className="text-gray-900">
                      {" "}
                      {product?.minOrder} Tonne
                    </span>
                  </h1>
                </div>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          ratevalue > rating ? "text-primary" : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="ml-2 flex items-center gap-3">
                    <p className="text-gray-500">
                      ( {calculateAverageRating(reviews)})
                    </p>
                    <p className="text-gray-700">{reviews.length} reviews</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div
                  className="space-y-6 text-base text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product?.fullDescription }}
                />
              </div>

              <div className="mt-6">
                <div className=" mt-10 flex">
                  <button
                    onClick={!inCart && !checking ? handleAddToCart : null}
                    disabled={addingtocart}
                    className="flex max-w-xs gap-3 flex-1 items-center justify-center rounded-md border border-transparent bg-primary py-3 px-8 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    {inCart && <CheckIcon className="h-7 w-10" />}
                    {addingtocart ? (
                      <span>Adding to cart....</span>
                    ) : (
                      <span>
                        {inCart ? "Added to tswaanda" : "Add to tswaanda"}
                      </span>
                    )}
                    {/* <ShoppingCartIcon  className="h-7 w-10"/> */}
                  </button>

                  <button
                    type="button"
                    onClick={isFavourite ? null : addToFavourites}
                    className="ml-4 flex items-center justify-center rounded-md py-3 px-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    {addingtoFav ? (
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
                      <>
                        {isFavourite ? (
                          <ToolTip tooltip="Added to your favourites">
                            <SolidHeartIcon
                              className="h-7 w-7 flex-shrink-0"
                              aria-hidden="true"
                            />
                          </ToolTip>
                        ) : (
                          <ToolTip tooltip="Add to favourites">
                            <HeartIcon
                              className="h-7 w-7 flex-shrink-0"
                              aria-hidden="true"
                            />
                          </ToolTip>
                        )}
                      </>
                    )}

                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
                {inCart && (
                  <div className="sm:flex-col1 mt-3 flex">
                    <button
                      onClick={handleGoToCart}
                      className="flex max-w-xs gap-3 flex-1 items-center justify-center rounded-md border border-transparent bg-primary py-3 px-8 text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                    >
                      <span> Go to Cart</span>
                    </button>
                  </div>
                )}
                <div className="mt-3 flex flex-between space-x-3">
                  <FacebookShareButton
                    url={'https://www.tswaanda.com'}
                    quote={'I got my fresh produce from Tswaanda!'}
                    hashtag="#BuyFromTswaanda"
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>

                  <TwitterShareButton
                    url={'https://www.tswaanda.com'}
                    title="I got my fresh produce from Tswaanda."
                    hashtags={['ReliableProduce', 'TswaandaProduce', 'SupportingAfricaFarmers']}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>

                  <LinkedinShareButton
                    url={"https://www.tswaanda.com"}
                    title="Buy your farm produce from Tswaanda"
                    summary="Get your products from a reliable marketplace that is supporting farmers in Africa."
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>

                  <EmailShareButton
                    url={"https://www.tswaanda.com"}
                    subject="Tswaanda Product"
                    body="Please find attached below the product from Tswaanda Marketplace."
                    separator=" "
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
                

              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
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
                              Shipping
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
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <ul role="list">
                            <li>
                              Shipping will be initiated on down payments,
                            </li>
                            <li>
                              Available for shipping to SA, AU, EU, US, UK
                            </li>
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
                              Reviews
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
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <button
                            onClick={handleLeaveReview}
                            className="text-white hover:bg-green-700 bg-green-500 py-1.5 px-2 mt-3 mb-5"
                          >
                            Leave a review
                          </button>
                          {openReviewModal && (
                            <LeaveReview
                              {...{ setOpenReviewModal, id, getProductReviews }}
                            />
                          )}
                          <ul role="list">
                            {reviews?.map((review: any, index: number) => (
                              <li key={index} className="mb-4">
                                <div className="flex items-center">
                                  <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                      <StarIcon
                                        key={rating}
                                        className={classNames(
                                          review.rating > rating
                                            ? "text-primary"
                                            : "text-gray-300",
                                          "h-5 w-5 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                      />
                                    ))}
                                  </div>
                                  <div className="ml-2 flex items-center gap-2">
                                    <p className=" font-semibold">
                                      {review.userName} {review.userLastName}
                                    </p>
                                    <p className="text-gray-500">
                                      {formatOrderDate(review.created)}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2 text-gray-700">
                                  {review.review}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="h-screen">
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
}
