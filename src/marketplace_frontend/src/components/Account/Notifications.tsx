const announcements = [
  {
    id: 1,
    title: 'New produce available',
    preview:
      'New high-quality produce available! Discover fresh, locally sourced fruits and vegetables on the Tswaanda marketplace.',
  },
  {
    id: 2,
    title: 'Coffee recently listed',
    preview:
      'Your favorite farmer just listed a batch of premium-grade coffee beans. Place your order before they run out',
  },
  {
    id: 3,
    title: 'Updated delivery',
    preview:
      'New delivery options available! Choose your preferred shipping method and enjoy hassle-free sourcing.',
  },
]

export default function Notifications() {
  return (
    <div>
      <div className="mt-6 flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="py-5">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a href="#" className="hover:underline focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {announcement.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{announcement.preview}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a
          href="#"
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          View all
        </a>
      </div>
    </div>
  )
}
