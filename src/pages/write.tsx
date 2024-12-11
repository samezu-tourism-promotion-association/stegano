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
import { getCookie, setCookie, hasCookie } from "cookies-next/client";
import { v4 as uuidv4 } from "uuid";
import templates from "@/lib/templates";
import Letter from "@/components/Letter";
import { useRouter } from "next/router";
import { saveLetterImage, saveLetterPdf } from "@/lib/save";

export default function Write() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [encoded, setEncoded] = useState<string | undefined>(undefined);
  const [template, setTemplate] = useState<number>(0);
  const templateKeys = templates ? Object.keys(templates) : [];
  const router = useRouter();

  const encodeText = async () => {
    if (text && prompt) {
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
          `${process.env.NEXT_PUBLIC_MODAL_API_URL}/encode?secret=${binaryTextJson.binary}&prompt=${prompt}&min_prob=0.015&device=cuda:0&language=ja&model_name=leia-llm/Leia-Swallow-7b`
        );
        const data = await res.json();
        setEncoded(data);
        setLoading(false);
        if (hasCookie("created")) {
          const created = JSON.parse(getCookie("created") as string);
          setCookie(
            "created",
            JSON.stringify([
              {
                type: templateKeys[template],
                createdAt: new Date(),
                text: text,
                prompt: prompt,
                encoded: `${prompt}\n${data}`,
                id: uuidv4(),
              },
              ...created,
            ])
          );
        } else {
          setCookie(
            "created",
            JSON.stringify([
              {
                type: templateKeys[template],
                createdAt: new Date(),
                text: text,
                prompt: prompt,
                encoded: `${prompt}\n${data}`,
                id: uuidv4(),
              },
            ])
          );
        }
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
            </DialogTitle>
          </div>
        </DialogPanel>
      </Dialog>
      <NextSeo title="年賀状をつくる - ステ賀乃" />
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
            <label className="block pt-12 text-xl font-bold" htmlFor="prompt">
              文章の出だし
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
            <label className="block pt-6 text-xl font-bold" htmlFor="secret">
              埋め込みたいコトバ
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
            <Button
              className="mt-8 w-full"
              bgColor="bg-primary"
              text="埋め込む"
              onClick={() => {
                encodeText();
              }}
            />
          </>
        )}
      </main>
    </Layout>
  );
}
