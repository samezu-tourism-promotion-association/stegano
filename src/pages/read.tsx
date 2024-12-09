import Button from "@/components/Button";
import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import { useRef } from "react";
import { Camera, CameraType } from "react-camera-pro";
import { RiCamera3Line } from "react-icons/ri";

export default function Read() {
  const camera = useRef<CameraType>(null);

  return (
    <Layout>
      <NextSeo title="よむ - ステ賀乃" />
      <Header back="/" title="よむ" />
      <main className="max-w-4xl mx-auto pb-16">
        <div className="relative max-w-lg mx-auto aspect-square">
          <Camera ref={camera} errorMessages={{}} facingMode="environment" />
        </div>
        <div className="px-4">
          <Button
            onClick={() => camera.current?.takePhoto()}
            text="撮影"
            icon={RiCamera3Line}
            className="w-full px-4 my-8"
          />
        </div>
      </main>
    </Layout>
  );
}
