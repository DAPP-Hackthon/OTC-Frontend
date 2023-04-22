import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "tailwindcss/base.css";
import "tailwindcss/components.css";
import "tailwindcss/utilities.css";
import Init from "@/util";
import Navbar from "@/components/navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Init>
      <div className="relative min-h-screen  bg-[#13231D]">
        <div
          className="relative inset-0 z-0  bg-cover "
          style={{ backgroundImage: "url('/backgroundImage.png')" }}
        >
          <div className="relative min-h-screen">
            <Navbar />
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </Init>
  );
}
