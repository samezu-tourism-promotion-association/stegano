import Button from "@/components/Button";
import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";
import {
  RiCamera3Line,
  RiRestartLine,
  RiMenuSearchLine,
  RiLoader4Fill,
  RiFileTextLine,
} from "react-icons/ri";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Read() {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | ImageData | undefined>(undefined);
  const [text, setText] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [decoded, setDecoded] = useState<string | undefined>(undefined);
  const models = [
    "sbintuitions/sarashina2-7b",
    "llm-jp/llm-jp-3-1.8b",
    "leia-llm/Leia-Swallow-7b",
    "rinna/youri-7b",
    "augmxnt/shisa-gamma-7b-v1",
  ];

  const analyzeImage = async () => {
    // request to cloud vision api
    try {
      if (typeof image === "string") {
        const base64String = image.replace(/^data:image\/[a-z]+;base64,/, "");
        const apiKey = process.env.NEXT_PUBLIC_CLOUD_VISION_API_KEY;
        const res = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requests: [
                {
                  image: {
                    content: base64String,
                  },
                  features: [
                    {
                      type: "TEXT_DETECTION",
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await res.json();
        if (data.responses && data.responses[0].fullTextAnnotation) {
          setText(data.responses[0].fullTextAnnotation.text);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decodeText = async () => {
    if (text) {
      setLoading(true);
      try {
        // request to https://opera7133--himitsu-fastapi-app-dev.modal.run/decode
        // const res = await fetch(
        //   "https://opera7133--himitsu-fastapi-app-dev.modal.run/decode",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       cover_text: text.split("\n").slice(1).join(),
        //       prompt: text.split("\n")[0],
        //       language: "ja",
        //       model_name: "leia-llm/Leia-Swallow-7b",
        //       device: "cuda:0",
        //     }),
        //   }
        // );
        // const data = await res.json();
        // setDecoded(data.decoded_text);
        setDecoded(`2月の【VIP限定感謝フェア】では、〇〇様だけの特別価格をご案内させていただきます。

また、ご来店の際には、専属のコンシェルジュがご案内をさせていただき、ゆっくりとお買い物をお楽しみいただけます。`);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <Layout>
      <NextSeo title="よむ - ステ賀乃" />
      <Header back="/" title="よむ" />
      <Dialog
        open={loading}
        onClose={() => {}}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="rounded-lg max-w-lg bg-white p-4">
          <div className="py-8 px-8 flex flex-col items-center gap-6">
            <RiLoader4Fill size={72} className="animate-spin" />
            <DialogTitle className="font-bold text-xl font-kaisei">
              コトバを戻しています
            </DialogTitle>
          </div>
        </DialogPanel>
      </Dialog>
      <main className="max-w-4xl mx-auto pb-16">
        {image ? (
          <>
            <div className="relative max-w-lg mx-auto aspect-square">
              {typeof image === "string" && (
                <img
                  src={image}
                  alt="Captured"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            {text && (
              <div className="px-4 my-4">
                <p className="font-bold mt-4 text-lg">
                  読み取り結果はあっていますか？
                </p>
                <textarea
                  className="w-full p-3 my-4 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
                  readOnly
                  rows={5}
                >
                  {text}
                </textarea>
              </div>
            )}
            <div className="px-4 flex flex-col gap-4 my-4">
              {text ? (
                <Button
                  onClick={() => {}}
                  text="コトバに戻す"
                  icon={RiFileTextLine}
                  className="w-full px-4"
                  bgColor="bg-secondary"
                />
              ) : (
                <Button
                  onClick={() => analyzeImage()}
                  text="解析"
                  icon={RiMenuSearchLine}
                  className="w-full px-4"
                  bgColor="bg-secondary"
                />
              )}
              <Button
                onClick={() => setImage(undefined)}
                text="やり直し"
                icon={RiRestartLine}
                className="w-full px-4"
              />
            </div>
          </>
        ) : (
          <>
            <div className="relative max-w-lg mx-auto aspect-square">
              <Camera
                ref={camera}
                errorMessages={{}}
                facingMode="environment"
              />
            </div>
            <div className="px-4">
              <Button
                onClick={() => setImage(camera.current?.takePhoto())}
                text="撮影"
                icon={RiCamera3Line}
                className="w-full px-4 my-8"
              />
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
