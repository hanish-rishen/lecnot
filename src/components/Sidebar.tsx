import { FaHome, FaHistory, FaCog } from 'react-icons/fa';

export default function Sidebar() {
    return (
      <div className="w-64 bg-black text-white p-6 border-r border-white/30">
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center py-2 px-4 rounded hover:bg-gray-900 transition duration-300">
                <FaHome className="mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center py-2 px-4 rounded hover:bg-gray-900 transition duration-300">
                <FaHistory className="mr-2" />
                History
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center py-2 px-4 rounded hover:bg-gray-900 transition duration-300">
                <FaCog className="mr-2" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }