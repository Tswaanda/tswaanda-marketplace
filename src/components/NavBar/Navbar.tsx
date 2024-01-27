import { useEffect, useState, Fragment } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { navigation } from "../../constants";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { setIsRegistered } from "../../state/globalSlice";

import Favorites from "./Favorites";
import LoginModal from "./LoginModal";
import Notifications from "../../scenes/Notifications/components/Notifications";

import { useAuth } from "../../hooks/ContextWrapper";
import KYCModal from "../KYCModal";
import { Logo } from "../../assets";
import { CustomerType } from "./types";
import { CartItem } from "../../declarations/marketplace_backend/marketplace_backend.did";
import { UserNotification } from "../../declarations/tswaanda_backend/tswaanda_backend.did";

const user = {
  imageUrl: "./avatar.webp",
};

const accNavigation = [
  { name: "Dashboard", href: "/account" },
  { name: "Orders", href: "/orders" },
  { name: "Market", href: "/market" },
  { name: "Support", href: "/support" },
];

const userNavigation = [
  { name: "Your Profile", href: "/account" },
  { name: "Settings", href: "/account" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const {
    logout,
    backendActor,
    adminBackendActor,
    identity,
    isAuthenticated,
    updateNotications,
    setUpdateNotifications,
    wsMessage,
  } = useAuth();
  const [showKycModal, setShowKycModal] = useState(false);
  const [userNotifications, setUserNotifications] = useState<
    UserNotification[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFavourites, setOpenFavourites] = useState(false);

  const [userInfo, setUserInfo] = useState<CustomerType | null>(null);

  const [cartItems, setCartItems] = useState<CartItem | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleCloseNotification = () => {
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const location = useLocation();

  const commonClassName =
    "inline-flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900";

  const activeClassName =
    "inline-flex items-center rounded-md py-2 px-3 text-sm font-medium text-green-500";

  interface Response {
    err?: any;
    ok?: any;
  }

  const getMyKYC = async () => {
    if (isAuthenticated) {
      const info: Response = await backendActor.getKYCRequest(
        identity?.getPrincipal()
      );
      if (info.ok) {
        setUserInfo(info.ok);
        dispatch(setIsRegistered());
      } else {
        setShowKycModal(true);
      }
    }
  };

  const getCartsNum = async () => {
    const res = await backendActor.getMyCartItem(identity?.getPrincipal());
    if ("ok" in res) {
      setCartItems(res.ok);
    }
  };

  const getUnreadNotification = async () => {
    const res = await adminBackendActor.getUnreadUserNotifications();
    setUserNotifications(res);
  };

  useEffect(() => {
    if (updateNotications) {
      getUnreadNotification();
      setUpdateNotifications(false);
    }
  }, [updateNotications]);

  useEffect(() => {
    getUnreadNotification();
  }, [wsMessage]);

  useEffect(() => {
    if (identity) {
      getMyKYC();
      getCartsNum();
      getUnreadNotification();
    }
  }, [identity]);

  return (
    <nav className="bg-white pb-4 relative">
      <>
        {showKycModal && (
          <KYCModal
            show={showKycModal}
            onClose={() => setShowKycModal(false)}
          />
        )}
      </>
      {isAuthenticated === false || mobileMenuOpen ? (
        <div className="px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Link to="/" className="-m-1.5 p-1.5">
                  <img className="h-8" src={Logo} alt="logo" />
                </Link>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className="font-semibold text-gray-900 hover:text-gray-900"
                  >
                    {item.name}
                  </NavLink>
                ))}
                <a
                  href="https://tswaanda.medium.com/"
                  target="_blank"
                  className="font-semibold text-gray-900 hover:text-gray-900"
                >
                  Blog
                </a>
              </div>
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
                <button
                  onClick={handleOpenModal}
                  className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-primary hover:ring-gray-900/20"
                >
                  Log in
                </button>
                {isModalOpen && (
                  <LoginModal
                    openModal={isModalOpen}
                    setOpenModal={setIsModalOpen}
                  />
                )}
              </div>
            </nav>
            <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
                <div className="flex h-9 items-center justify-between">
                  <div className="flex">
                    <a href="#" className="-m-1.5 p-1.5">
                      <span className="sr-only">Tswaanda</span>
                      <img className="h-8" src={Logo} alt="logo" />
                    </a>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                        >
                          {item.name}
                        </NavLink>
                      ))}
                      <a
                        href="https://tswaanda.medium.com/"
                        target="_blank"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                      >
                        Blog
                      </a>
                    </div>
                    <div className="py-6">
                      <button
                        onClick={handleOpenModal}
                        className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10 cursor-pointer"
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </div>
        </div>
      ) : (
        <Disclosure as="header" className="bg-white ">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
                <div className="relative flex h-16 justify-between">
                  <div className="relative z-10 flex px-2 lg:px-0">
                    <div className="flex flex-shrink-0 items-center">
                      <Link to={"/"}>
                        <img
                          className="block h-8 w-auto"
                          src={Logo}
                          alt="Tswaanda"
                        />
                      </Link>
                    </div>
                  </div>
                  {window.innerWidth > 768 ? (
                    <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                      <div className="w-full max-w-xs">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            name="search"
                            id="search"
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
                            placeholder="Search"
                            type="search"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="relative z-10 flex items-center lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900">
                      <span className="sr-only">Open menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:relative gap-3 lg:z-10 lg:ml-4 lg:flex lg:items-center">
                    <Favorites {...{ openFavourites, setOpenFavourites }} />
                    <button onClick={() => setOpenFavourites(true)}>
                      <HeartIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {cartItems && (
                      <Link to="/shopping-cart">
                        <span className="relative inline-block">
                          <ShoppingCartIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />

                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            1
                          </span>
                        </span>
                      </Link>
                    )}
                    <button
                      className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 "
                      onClick={handleNotificationClick}
                    >
                      <span className="relative inline-block">
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        {userNotifications.length > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {userNotifications.length}
                          </span>
                        )}
                      </span>
                    </button>
                    {showNotifications && (
                      <Notifications
                        {...{ handleCloseNotification, userNotifications }}
                      />
                    )}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={
                              userInfo?.body.profilePhoto
                                ? userInfo.body.profilePhoto
                                : user.imageUrl
                            }
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block py-2 px-4 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            {({ active }) => (
                              <h1
                                onClick={() => {
                                  logout();
                                  navigate("/");
                                  window.location.reload();
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block cursor-pointer py-2 px-4 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </h1>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>

                {[
                  "/",
                  "/account",
                  "/orders",
                  "/market",
                  "/shopping-cart",
                  "/support",
                ].includes(location.pathname) && (
                  <nav
                    className="hidden lg:flex lg:space-x-8 lg:py-2"
                    aria-label="Global"
                  >
                    {accNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${commonClassName} ${
                          location.pathname === item.href ? activeClassName : ""
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
              <Disclosure.Panel
                as="nav"
                className="lg:hidden"
                aria-label="Global"
              >
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.to}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={userInfo?.body[0]?.profilePhoto || user.imageUrl}
                        alt="profilePhoto"
                      />
                    </div>
                    {userInfo && (
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {userInfo?.body[0]?.firstName}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {userInfo?.body[0]?.email}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </nav>
  );
};

export default Navbar;
