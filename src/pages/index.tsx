import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import Header from "@/components/Header";
import Letter from "@/components/Letter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Layout>
      <NextSeo title="ステ賀乃" />
      <Header home />
      <main className="max-w-4xl mx-auto px-4 pb-16 text-primary">
        <div className="pt-12">
          <h2 className="text-2xl font-bold">つくった年賀状</h2>
          <div className="mt-8 flex items-start gap-4 overflow-x-scroll">
            <Letter blank />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
          </div>
        </div>
        <div className="pt-12">
          <h2 className="text-2xl font-bold">読んだ年賀状</h2>
          <div className="mt-8 flex items-start gap-4 overflow-x-scroll">
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
            <Letter title="テスト" image="https://picsum.photos/512/512" />
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
