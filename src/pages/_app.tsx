import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Kaisei_Tokumin } from "next/font/google";
import { Toaster } from "react-hot-toast";

const kaiseiTokumin = Kaisei_Tokumin({
  weight: "400",
  style: "normal",
  variable: "--font-kaisei-tokumin",
  preload: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-kaisei-tokumin: ${kaiseiTokumin.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
