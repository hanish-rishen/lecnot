import { OrbitingCirclesDemo } from "@/components/OrbitingCircles";
import { ShinyButtonDemo } from "@/components/ShinyButton";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-b from-black to-gray-900 text-white">
      <section className="flex flex-col items-center text-center mt-10 md:mt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">lecnot is the new way to generate notes for you.</h1>
        <p className="text-lg md:text-xl mb-8">Effortlessly organize your thoughts and ideas with lecnot. Our intuitive interface and powerful features make note-taking a breeze.</p>
        <ShinyButtonDemo />
      </section>
      <section className="flex flex-col items-center mt-10 md:mt-20 w-full">
        <div className="w-full max-w-4xl">
          <OrbitingCirclesDemo />
        </div>
      </section>
    </main>
  );
}