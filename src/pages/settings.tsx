import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";

export default function Read() {
  return (
    <Layout>
      <NextSeo title="設定 - ステ賀乃" />
      <Header back="/" title="設定" />
      <main className="max-w-4xl mx-auto pb-16"></main>
    </Layout>
  );
}
