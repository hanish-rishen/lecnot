import ShinyButton from "@/components/magicui/shiny-button";
import Link from "next/link";

export function ShinyButtonDemo() {
  return (
    <Link href="/signin">
      <ShinyButton text="Start Generating Notes Now →" className="text-lg" />
    </Link>
  );
}