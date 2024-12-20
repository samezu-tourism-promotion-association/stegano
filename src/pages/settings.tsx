import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import Image from "next/image";

export default function Read() {
  const [, setCreatedLetters] = useLocalStorage<Letter[]>("created", []);
  const [, setReadLetters] = useLocalStorage<Letter[]>("read", []);
  const deleteReadHistory = () => {
    setReadLetters([]);
    toast.success("読んだ履歴を削除しました");
  };
  const deleteCreatedHistory = () => {
    setCreatedLetters([]);
    toast.success("作成履歴を削除しました");
  };
  return (
    <Layout>
      <NextSeo title="設定 - ステ賀乃" noindex nofollow />
      <Header back="/" title="設定" />
      <main className="max-w-4xl mx-auto pb-16 px-4">
        <Image
          src="/mizuhiki.png"
          width={200}
          height={200}
          alt="Stegano Logo"
          className="mx-auto pt-12"
        />
        <p className="text-center text-black text-4xl font-bold mt-8">
          ステ賀乃
        </p>
        <div className="flex flex-col justify-center gap-2 mt-12">
          <Button onClick={deleteReadHistory} text="読んだ履歴を削除" />
          <Button onClick={deleteCreatedHistory} text="作成履歴を削除" />
        </div>
      </main>
    </Layout>
  );
}
