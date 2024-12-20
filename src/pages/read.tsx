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
  RiFileImageLine,
  RiFilePdf2Line,
  RiHome4Line,
  RiUploadLine,
} from "react-icons/ri";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";
import Letter from "@/components/Letter";
import { saveLetterImage, saveLetterPdf } from "@/lib/save";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { models } from "@/lib/models";
import templates from "@/lib/templates";
import { useLocalStorage } from "usehooks-ts";

export default function Read() {
  const router = useRouter();
  const camera = useRef<CameraType>(null);
  const [readLetters, setReadLetters] = useLocalStorage<Letter[]>("read", []);
  const [image, setImage] = useState<string | ImageData | undefined>(undefined);
  const [text, setText] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [decoded, setDecoded] = useState<string | undefined>(undefined);
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [model, setModel] = useState<string>("leia-llm/Leia-Swallow-7b");
  const [minProb, setMinProb] = useState<number>(0.005);
  const uploadRef = useRef<HTMLInputElement>(null);

  const analyzeImage = async () => {
    // request to cloud vision api
    const loadingToast = toast.loading("解析中...");
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
          setTemplateId(
            data.responses[0].fullTextAnnotation.text.split("\n")[0]
          );
          toast.success("読み取りに成功しました", {
            id: loadingToast,
          });
        }
      }
    } catch (error) {
      toast.error("読み取りに失敗しました", {
        id: loadingToast,
      });
      console.error(error);
    }
  };

  const decodeText = async () => {
    if (text && minProb && model) {
      setLoading(true);
      try {
        if (text.split("\n").length < 3) {
          setLoading(false);
          toast.error("不正なフォーマットです");
          return;
        }
        if (!templates[text.split("\n")[0]]) {
          setLoading(false);
          toast.error("テンプレートが見つかりませんでした");
          return;
        }
        const prompt = text.split("\n")[1];
        const mainText = text.split("\n").slice(2).join("").replace(/\s+/g, "");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MODAL_API_URL}/decode?cover_text=${mainText}&prompt=${prompt}&min_prob=${minProb}&model_name=${model}`
        );
        const data = await res.json();
        const normalText = await fetch("/api/decode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ binary: data }),
        });
        const normalTextJson = await normalText.json();
        setDecoded(normalTextJson.text);
        setTemplateId(text.split("\n")[0]);
        setLoading(false);
        setReadLetters([
          {
            type: text.split("\n")[0],
            createdAt: new Date().toString(),
            text: normalTextJson.text,
            prompt: prompt,
            status: "read",
            encoded: mainText,
            id: uuidv4(),
          },
          ...readLetters,
        ]);
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error("デコードに失敗しました。読み取った文字列は正しいですか？");
      }
    }
  };

  return (
    <Layout>
      <NextSeo title="よむ - ステ賀乃" noindex nofollow />
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
              <br />
              最大20秒程度かかります
            </DialogTitle>
          </div>
        </DialogPanel>
      </Dialog>
      <main className="max-w-4xl mx-auto pb-16">
        {decoded ? (
          <>
            <div className="w-full flex items-center justify-center my-8">
              <Letter template={templateId!} text={decoded} />
            </div>
            <Button
              className="mt-8 w-full"
              bgColor="bg-primary"
              text="写真に記録"
              icon={RiFileImageLine}
              onClick={() => {
                saveLetterImage();
              }}
            />
            <Button
              className="mt-4 w-full"
              bgColor="bg-secondary"
              text="PDFとして保存"
              icon={RiFilePdf2Line}
              onClick={() => {
                saveLetterPdf();
              }}
            />
            <Button
              className="mt-4 w-full"
              bgColor="bg-tertiary"
              text="ホームへ戻る"
              icon={RiHome4Line}
              onClick={() => {
                router.push("/");
              }}
            />
          </>
        ) : image ? (
          <>
            <div className="relative max-w-lg mx-auto">
              {typeof image === "string" && (
                <img
                  src={image}
                  alt="Captured"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            {text && (
              <>
                <div className="px-4 my-4">
                  <p className="font-bold mt-4 text-lg">
                    読み取り結果はあっていますか？（あっていない場合は修正）
                  </p>
                  <textarea
                    className="w-full p-3 mt-4 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
                    rows={5}
                    onChange={(e) => setText(e.target.value)}
                  >
                    {text}
                  </textarea>
                </div>
                <details className="px-4 mb-8">
                  <summary className="text-xl font-bold cursor-pointer">
                    高度な設定
                  </summary>
                  <div>
                    <label
                      className="block py-4 text-lg font-bold"
                      htmlFor="model"
                    >
                      言語モデル
                    </label>
                    <select
                      id="model"
                      name="model"
                      className="w-full p-3 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
                      onChange={(e) => {
                        setModel(e.target.value);
                      }}
                      value={model}
                    >
                      {models.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block py-4 text-lg font-bold"
                      htmlFor="minProb"
                    >
                      min_prob
                    </label>
                    <input
                      id="minProb"
                      name="minProb"
                      type="number"
                      step="0.001"
                      min="0.0001"
                      max="0.1"
                      className="w-full p-3 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
                      onChange={(e) => {
                        setMinProb(parseFloat(e.target.value));
                      }}
                      value={minProb}
                    />
                  </div>
                </details>
              </>
            )}
            <div className="px-4 flex flex-col gap-4 my-4">
              {text ? (
                <Button
                  onClick={() => {
                    decodeText();
                  }}
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
                onClick={() => {
                  setImage(undefined);
                  setText(undefined);
                }}
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
                className="w-full px-4 my-4"
              />
              <Button
                onClick={() => {
                  uploadRef.current?.click();
                }}
                text="画像をアップロード"
                icon={RiUploadLine}
                bgColor="bg-secondary"
                className="w-full px-4 my-4"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={uploadRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (typeof e.target?.result === "string")
                        setImage(e.target?.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
