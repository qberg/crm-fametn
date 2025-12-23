import { createMetadata } from "@repo/seo/metadata";
import { Button } from "@repo/design-system/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Home",
  description: "Welcome to our app",
});

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen container">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-oswald text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Turbo Forge.
        </h1>
        <p className="max-w-2xl leading-normal sm:text-xl sm:leading-8 font-manrope text-gray-400">
          Open systems. Strong architecture. Software that lasts.
        </p>
      </div>

      <footer className="">
        <div className="py-4 md:py-6 max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-center text-sm leading-loose sm:text-left">
            Built by qberg.
          </p>
        </div>
        <Button>Test</Button>
      </footer>
    </div>
  );
}
