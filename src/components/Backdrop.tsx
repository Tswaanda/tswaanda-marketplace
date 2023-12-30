export default function Backdrop({ children }) {
    return (
        <div className="flex justify-center items-center h-screen w-screen fixed top-0 left-0 z-50 bg-black bg-opacity-40">
            {children}
        </div>
    )
}