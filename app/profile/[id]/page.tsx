export default function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <hr className="border-t border-gray-300 w-full mb-4" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="text-xl mb-2">Welcome to your profile!</p>
        <p className="text-4xl font-bold mb-4">
          User ID: <span className="p-2 bg-orange-500 text-white rounded-md">{params.id}</span>
        </p>
        {/* Add more information about the user if needed */}
        {/* Example: */}
        {/* <p className="text-lg">Email: example@example.com</p> */}
        {/* <p className="text-lg">Joined on: January 1, 2023</p> */}
      </div>
    </div>
  );
}
