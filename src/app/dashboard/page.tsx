import { ShinyButtonDemo } from "@/components/ShinyButton";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-24">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8">Dashboard</h1>
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-50 rounded-lg p-8 backdrop-blur-xl">
          <div className="border-2 border-dashed border-gray-600 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-300 text-xl text-center">No files uploaded yet. Click the button below to get started.</p>
          </div>
          <div className="mt-8 flex justify-center">
            <ShinyButtonDemo />
          </div>
        </div>
      </div>
    </main>
  );
}