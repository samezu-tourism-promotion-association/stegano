import Button from "@/components/Button";
import Header from "@/components/Header";
import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import Image from "next/image";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseFill,
  RiLoader4Fill,
} from "react-icons/ri";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

export default function Write() {
  const [loading, setLoading] = useState(false);
  return (
    <Layout>
      <Dialog
        open={loading}
        onClose={() => {}}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="rounded-lg max-w-lg bg-white p-4">
          {/* <button
            onClick={() => {
              setLoading(false);
            }}
          >
            <RiCloseFill size={40} />
          </button> */}
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
      <main className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mt-12">
          <button>
            <RiArrowLeftSLine size={52} className="fill-primary" />
          </button>
          <div className="relative max-w-80 w-full aspect-[2/3]">
            <Image
              src="/newyearard.svg"
              layout="fill"
              objectFit="cover"
              alt="Letter Sample 1"
            />
          </div>
          <button>
            <RiArrowRightSLine size={52} className="fill-primary" />
          </button>
        </div>
        <h2 className="pt-12 text-2xl font-bold">埋め込みたいコトバ</h2>
        <textarea
          className="w-full p-3 mt-4 text-black bg-gray-100 focus:ring-primary focus:border-primary rounded-lg"
          placeholder="ここにコトバをかいてください"
          rows={5}
        ></textarea>
        <Button
          className="mt-8 w-full"
          bgColor="bg-primary"
          text="埋め込む"
          onClick={() => {
            setLoading(true);
          }}
        />
      </main>
    </Layout>
  );
}
