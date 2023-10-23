import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

const categories = {
  Information: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Technical: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
const posts = [
  {
    id: 1,
    name: 'Agriculture HSCodes.',
    href: '/article',
    category: 'Information',
    createdBy: 'CN',
    lastUpdated: '2023-03-17T00:00Z',
  },
  {
    id: 2,
    name: 'Listing products on Tswaanda.',
    href: '#',
    category: 'Technical',
    createdBy: 'EC',
    lastUpdated: '2023-05-05T00:00Z',
  },
  {
    id: 3,
    name: 'Purchasing products, and settlement.',
    href: '#',
    category: 'Information',
    createdBy: 'CN',
    lastUpdated: '2023-05-25T00:00Z',
  },
  {
    id: 4,
    name: 'Introduction to Internet Identity.',
    href: '#',
    category: 'Technical',
    createdBy: 'EC',
    lastUpdated: '2023-06-07T00:00Z',
  },
  {
    id: 5,
    name: 'Partnerships',
    href: '#',
    category: 'Information',
    createdBy: 'SM',
    lastUpdated: '2023-06-10T00:00Z',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
  
  export default function Documentation() {
    
    return (

      
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tswaanda Business Documentation</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Documentation to help you understand how we operate
            </p>
            
            <ul role="list" className="divide-y divide-gray-100">
              {posts.map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-x-6 py-5">
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{post.name}</p>
                      <p
                        className={classNames(
                          categories[post.category],
                          'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                        )}
                      >
                        {post.category}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                      <p className="whitespace-nowrap">
                        Last updated <time>{post.lastUpdated}</time>
                      </p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p className="truncate">Posted by {post.createdBy}</p>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                    <a
                      href={post.href}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      View Docs<span className="sr-only">, {post.name}</span>
                    </a>
                    {/* <Menu as="div" className="relative flex-none">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                              >
                                Edit<span className="sr-only">, {post.name}</span>
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                              >
                                Move<span className="sr-only">, {post.name}</span>
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                              >
                                Delete<span className="sr-only">, {post.name}</span>
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
  