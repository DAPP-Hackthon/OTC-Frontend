import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "tailwindcss/base.css";
import "tailwindcss/components.css";
import "tailwindcss/utilities.css";
import Init from "@/util";
import Navbar from "@/components/navbar";



export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className=" bg-[#13231D] overflow-y-auto bg-[url('/backgroundImage.png')] bg-cover">
      <Init>
        <div className="relative h-screen ">
          <Navbar />
          <div className="pt-[3rem] pb-auto xl:px-[6rem] lg:px-[6rem] md:px-[6rem] sm:px-[6rem] px-[2rem] ">
            <Component {...pageProps} />
          </div>
        </div>
      </Init>
    </div>
  );
}
