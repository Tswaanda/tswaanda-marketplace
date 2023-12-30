import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

export default function Disputes() {
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
        <div className="mx-auto lg:mx-0">
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Resolving Customer Disputes and Queries at Tswaanda.
          </h1>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-primary">
            Introduction
          </h2>
          <p className="mt-2 text-xl leading-8 text-gray-700">
            Welcome to Tswaanda, where we connect you with the freshest
            agricultural produce through our robust e-commerce platform. We
            understand that sometimes things don't go as planned, and we're here
            to ensure that any issues you face are resolved efficiently and
            satisfactorily. This article serves as your guide to navigating
            disputes or queries regarding our services.
          </p>
        </div>
        <div className="mx-auto mt-16 lg:mx-0 lg:mt-10 lg:max-w-none">
          <div className="relative lg:order-last lg:col-span-5">
            <svg
              className="absolute -top-[40rem] left-1 -z-10 h-[64rem] w-[175.5rem] -translate-x-1/2 stroke-gray-900/10 [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="e87443c8-56e4-4c20-9111-55b82fa704e3"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M0.5 0V200M200 0.5L0 0.499983" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)"
              />
            </svg>
            {/* <figure className="border-l border-primary pl-8">
              <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                <p>
                  “We had an issue with a seller of fresh produce, which was delivered very late. Tswaanda quickly chipped in with assistance on resolving the issue, and we finally got our product with a compensation from the seller.”
                </p>
              </blockquote>
              <figcaption className="mt-8 flex gap-x-4">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="mt-1 h-10 w-10 flex-none rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900">Brenna Goyette</div>
                  <div className="text-gray-600">@brenna</div>
                </div>
              </figcaption>
            </figure> */}
          </div>
          <div className="text-base leading-7 text-gray-700 lg:col-span-7">
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-primary">
              Common Disputes and Initial Steps
            </h2>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Late Delivery:
            </h3>
            <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
              <li>
                Causes can range from logistical challenges to unexpected
                weather conditions.{" "}
              </li>
              <li>
                First, check your delivery status on our app or website. If it's
                overdue, please let us know.
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Rotten or Damaged Produce:
            </h3>
            <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
              <li>
                We take great care in ensuring the quality of our products, but
                sometimes issues can occur.
              </li>
              <li>
                Report any quality concerns with photos of the produce via our
                app or website as soon as you receive your order.
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Undelivered Produce:
            </h3>
            <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
              <li>
                This could be due to supply hiccups or incorrect delivery
                details.
              </li>
              <li>
                Verify your address and order details. If everything seems
                correct, contact us for further assistance.
              </li>
            </ul>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-primary">
              Dispute Resolution Process
            </h2>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Step 1: Reporting the Issue
            </h3>
            <ul style={{ listStyleType: "lower-roman", marginLeft: "20px" }}>
              <li>
                You can report issues via our online form or customer service
                hotline.{" "}
              </li>
              <li>
                Include your order number and a detailed description of the
                problem.
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Step 2: Investigation and Response
            </h3>
            <ul style={{ listStyleType: "lower-roman", marginLeft: "20px" }}>
              <li>
                We aim to investigate and respond to all queries within 48
                hours.
              </li>
              <li>Our team will keep you updated throughout the process.</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Step 3: Resolution Options
            </h3>
            <ul style={{ listStyleType: "lower-roman", marginLeft: "20px" }}>
              <li>
                Depending on the issue, we offer refunds, replacements, or
                credits.
              </li>
              <li>
                Each case is handled individually to ensure a fair resolution.
              </li>
            </ul>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-primary">
              Follow-Up and Feedback
            </h2>
            <p>
              Your feedback is invaluable in helping us improve. After your
              dispute is resolved, we encourage you to share your experience
              through our feedback forms or directly with our customer service
              team.
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-primary">
              Additional Support and Resources
            </h2>
            <h4 className="mt-4 text-l font-semibold tracking-tight">
              For additional support:
            </h4>
            <ul style={{ listStyleType: "lower-roman", marginLeft: "20px" }}>
              <li>
                <span className="text-bold">Customer Service:</span> Contact us
                via phone at{" "}
                <span className="text-primary">+263 784 001 002</span>, email at{" "}
                <span className="text-primary">disputes@tswaanda.com</span>, or
                through our live chat service.
              </li>
              <li>
                <span className="text-bold text-blue-400 hover:underline">
                  <Link to="/faqs">FAQs:</Link>
                </span>{" "}
                Visit our FAQ section for answers to common questions.
              </li>
              <li>
                <span className="text-bold">Guides and Tutorials:</span> Learn
                how to make the most of our platform with our user-friendly
                guides.
              </li>
            </ul>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-primary">
              Conclusion:
            </h2>
            <p>
              At Tswaanda, your satisfaction is our priority. We are committed
              to addressing and resolving your concerns promptly and
              effectively. Please do not hesitate to reach out with any issues
              we're here to help!
            </p>

            {/* <h2 className="mt-6 text-2xl font-semibold tracking-tight text-primary">Appendix:</h2>
          <p>
            Explore real-life scenarios where customer disputes were handled positively, and read testimonials from our customers who experienced our dedicated support first-hand.
          </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
