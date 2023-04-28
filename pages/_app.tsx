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
        {/* <div className="relative min-h-screen overflow-y-auto  bg-[#13231D]">
          <div
            className="relative inset-0 z-0  bg-cover "
            style={{ backgroundImage: "url('/backgroundImage.png')" }}
          >
            <div className="relative h-screen "> */}
        <div className="relative h-screen ">
          <Navbar />
          <div className="pt-[3rem] pb-auto 2xl:px-[6rem] xl:px-[6rem] lg:px-[6rem] md:px-[6rem] sm:px-[6rem] px-[3rem] ">
            <Component {...pageProps} />
          </div>
        </div>
        {/* </div>
          </div>
        </div> */}
      </Init>
    </div>
  );
}
