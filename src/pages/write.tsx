import Button from "@/components/Button";
import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiLoader4Fill,
  RiHome4Line,
  RiFileImageLine,
  RiFilePdf2Line,
} from "react-icons/ri";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import templates from "@/lib/templates";
import Letter from "@/components/Letter";
import { useRouter } from "next/router";
import { saveLetterImage, saveLetterPdf } from "@/lib/save";
import { models } from "@/lib/models";
import { useLocalStorage } from "usehooks-ts";
import stringWidth from "string-width";
import toast from "react-hot-toast";

export default function Write() {
  const [createdLetters, setCreatedLetters] = useLocalStorage<Letter[]>(
    "created",
    []
  );
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [encoded, setEncoded] = useState<string | undefined>(undefined);
  const [template, setTemplate] = useState<number>(0);
  const [model, setModel] = useState<string>("leia-llm/Leia-Swallow-7b");
  const [minProb, setMinProb] = useState<number>(0.005);
  const templateKeys = templates ? Object.keys(templates) : [];
  const router = useRouter();

  const encodeText = async () => {
    if (text && prompt && minProb && model) {
      setLoading(true);
      try {
        const binaryText = await fetch("/api/encode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: text }),
        });
        const binaryTextJson = await binaryText.json();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MODAL_API_URL}/encode?secret=${binaryTextJson.binary}&prompt=${prompt}&min_prob=${minProb}&model_name=${model}`
        );
        const data = await res.json();
        setEncoded(data);
        setLoading(false);
        setCreatedLetters([
          {
            type: templateKeys[template],
            createdAt: new Date().toString(),
            text: text,
            prompt: prompt,
            status: "created",
            encoded: `${prompt}\n${data}`,
            id: uuidv4(),
          },
          ...createdLetters,
        ]);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <Layout>
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
              コトバを埋め込んでいます
              <br />
              最大20秒程度かかります
            </DialogTitle>
          </div>
        </DialogPanel>
      </Dialog>
      <NextSeo title="年賀状をつくる - ステ賀乃" noindex nofollow />
      <Header back="/" title="年賀状をつくる" />
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {encoded ? (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Letter
              template={templateKeys[template]}
              text={`${prompt}\n${encoded}`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() =>
                setTemplate(
                  (template - 1 + templateKeys.length) % templateKeys.length
                )
              }
            >
              <RiArrowLeftSLine size={52} className="fill-primary" />
            </button>
            <Letter template={templateKeys[template]} text={prompt} />
            <button
              onClick={() => setTemplate((template + 1) % templateKeys.length)}
            >
              <RiArrowRightSLine size={52} className="fill-primary" />
            </button>
          </div>
        )}
        {encoded ? (
          <>
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
        ) : (
          <>
            <div>
              <label className="block pt-12 text-xl font-bold" htmlFor="prompt">
                文章の出だし
                <span
                  className={
                    54 - stringWidth(prompt || "") >= 0
                      ? "text-black"
                      : "text-primary"
                  }
                >
                  （残り{54 - stringWidth(prompt || "")}）
                </span>
              </label>
              <input
                id="prompt"
                name="prompt"
                type="text"
                className="w-full p-3 mt-4 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
                placeholder="ここに出だしをかいてください"
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                value={prompt}
              />
            </div>
            <div>
              <label className="block pt-6 text-xl font-bold" htmlFor="secret">
                埋め込みたいコトバ
                <span
                  className={
                    150 - stringWidth(text || "") >= 0
                      ? "text-black"
                      : "text-primary"
                  }
                >
                  （残り{150 - stringWidth(text || "")}）
                </span>
              </label>
              <textarea
                id="secret"
                name="secret"
                className="w-full p-3 mt-4 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
                placeholder="ここにコトバをかいてください"
                rows={5}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
              ></textarea>
            </div>
            <details className="mt-4">
              <summary className="text-xl font-bold cursor-pointer">
                高度な設定
              </summary>
              <p className="mt-2">
                以下の欄を変更した場合、送り先に変更した値の情報を送る必要があります。
              </p>
              <div>
                <label className="block py-4 text-lg font-bold" htmlFor="model">
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
            <Button
              className="mt-8 w-full"
              bgColor="bg-primary"
              text="埋め込む"
              onClick={() => {
                if (text && prompt) {
                  if (stringWidth(text) > 150 || stringWidth(prompt) > 54) {
                    toast.error("文字数が多すぎます");
                  }
                  encodeText();
                }
              }}
            />
          </>
        )}
      </main>
    </Layout>
  );
}
