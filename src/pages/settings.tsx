import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import { deleteCookie } from "cookies-next";
import Button from "@/components/Button";
import toast from "react-hot-toast";

export default function Read() {
  const deleteReadHistory = () => {
    deleteCookie("read");
    toast.success("読んだ履歴を削除しました");
  };
  const deleteCreatedHistory = () => {
    deleteCookie("created");
    toast.success("作成履歴を削除しました");
  };
  return (
    <Layout>
      <NextSeo title="設定 - ステ賀乃" />
      <Header back="/" title="設定" />
      <main className="max-w-4xl mx-auto pb-16 px-4">
        <div className="flex flex-col justify-center gap-2 mt-12">
          <Button onClick={deleteReadHistory} text="読んだ履歴を削除" />
          <Button onClick={deleteCreatedHistory} text="作成履歴を削除" />
        </div>
      </main>
    </Layout>
  );
}
