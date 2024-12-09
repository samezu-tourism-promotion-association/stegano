import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";

export default function Read() {
  return (
    <Layout>
      <NextSeo title="よむ - ステ賀乃" />
      <Header back="/" title="よむ" />
      <main className="max-w-4xl mx-auto px-4"></main>
    </Layout>
  );
}
