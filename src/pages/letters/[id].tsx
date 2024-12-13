import Button from "@/components/Button";
import Layout from "@/layouts/Layout";
import Header from "@/components/Header";
import { NextSeo } from "next-seo";
import Letter from "@/components/Letter";
import { RiFileImageLine, RiHome4Line, RiFilePdf2Line } from "react-icons/ri";
import { saveLetterImage, saveLetterPdf } from "@/lib/save";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";
import templates from "@/lib/templates";

export default function LetterPage() {
  const router = useRouter();
  const [readLetters] = useLocalStorage<Letter[]>("read", []);
  const [createdLetters, setCreatedLetters] = useLocalStorage<Letter[]>(
    "created",
    []
  );
  const letters = readLetters.concat(createdLetters);
  const { id } = router.query;
  const letter = letters.find((letter) => letter.id === id);
  const templateKeys = templates ? Object.keys(templates) : [];
  if (!letter) {
    return null;
  }

  return (
    <Layout>
      <NextSeo title="よむ - ステ賀乃" noindex nofollow />
      <Header back="/" title="よむ" />
      <main className="max-w-4xl mx-auto px-4 pb-16 text-primary">
        <div className="w-full flex items-center justify-center my-8">
          <Letter
            template={letter.type as string}
            text={letter.status === "created" ? letter.encoded : letter.text}
          />
        </div>
        {letter.status === "created" && (
          <select
            id="template"
            name="template"
            className="w-full p-3 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
            onChange={(e) => {
              const newLetter = { ...letter, type: e.target.value };
              setCreatedLetters(
                createdLetters.map((l) => (l.id === id ? newLetter : l))
              );
            }}
            value={letter.type}
          >
            {templateKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        )}
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
      </main>
    </Layout>
  );
}
