import Button from "@/components/Button";
import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next/server";
import Layout from "@/layouts/Layout";
import Header from "@/components/Header";
import { NextSeo } from "next-seo";
import Letter from "@/components/Letter";
import { RiFileImageLine, RiHome4Line, RiFilePdf2Line } from "react-icons/ri";
import { saveLetterImage, saveLetterPdf } from "@/lib/save";
import { useRouter } from "next/router";

export default function LetterPage({ letter }: { letter: Letter }) {
  const router = useRouter();

  return (
    <Layout>
      <NextSeo title="よむ - ステ賀乃" />
      <Header back="/" title="よむ" />
      <main className="max-w-4xl mx-auto px-4 pb-16 text-primary">
        <div className="w-full flex items-center justify-center my-8">
          <Letter
            template={letter.type as string}
            text={letter.status === "created" ? letter.encoded : letter.text}
          />
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
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  let status = "created";

  const createdCookie = await getCookie("created", {
    req: context.req,
    res: context.res,
  });
  const createdLetters: Letter[] = createdCookie
    ? JSON.parse(createdCookie as string)
    : [];
  let letter = createdLetters.find((letter) => letter.id === id);
  if (!letter) {
    const readCookie = await getCookie("read", {
      req: context.req,
      res: context.res,
    });
    const readLetters: Letter[] = readCookie
      ? JSON.parse(readCookie as string)
      : [];
    letter = readLetters.find((letter) => letter.id === id);
    status = "read";
  }

  return {
    props: {
      letter: letter ? { ...letter, status } : null,
    },
  };
};
