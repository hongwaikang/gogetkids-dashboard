export default function Loading() {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="text-white text-6xl animate-fade-in">Loading...Please be patient</div>
        </div>
    );
}
