export default function Sidebar() {
    return (
      <div className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">LecNot</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-300">Dashboard</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-300">History</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700 transition duration-300">Settings</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }