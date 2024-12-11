import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import Header from "@/components/Header";
import LetterPreview from "@/components/LetterPreview";
import Footer from "@/components/Footer";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function Home() {
  const [createdLetters] = useLocalStorage("created", [], {
    initializeWithValue: false,
  });
  const [readLetters] = useLocalStorage("read", [], {
    initializeWithValue: false,
  });
  const [searchText, setSearchText] = useState<string>("");
  return (
    <Layout>
      <NextSeo title="ステ賀乃" noindex nofollow />
      <Header home setSearchText={setSearchText} searchText={searchText} />
      <main className="max-w-4xl mx-auto px-4 pb-16 text-primary">
        <div className="pt-12">
          <h2 className="text-2xl font-bold">つくった年賀状</h2>
          <div className="mt-8 flex items-start gap-4 overflow-x-scroll">
            {searchText ? (
              <>
                {createdLetters &&
                  createdLetters
                    .filter((letter: Letter) =>
                      letter.encoded.includes(searchText)
                    )
                    .map((letter: Letter) => (
                      <LetterPreview
                        key={letter.id}
                        template={letter.type as string}
                        text={letter.encoded}
                        id={letter.id}
                      />
                    ))}
              </>
            ) : (
              <>
                <Link
                  href="/write"
                  className="shrink-0 max-w-60 w-full aspect-[1/1.49] bg-primary/70 text-white flex flex-col gap-8 items-center justify-center"
                >
                  <RiAddLine size={80} />
                  <p className="text-2xl">年賀状をつくる</p>
                </Link>
                {createdLetters &&
                  createdLetters.map((letter: Letter) => (
                    <LetterPreview
                      key={letter.id}
                      template={letter.type as string}
                      text={letter.encoded}
                      id={letter.id}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
        <div className="pt-12">
          <h2 className="text-2xl font-bold">読んだ年賀状</h2>
          <div className="mt-8 flex items-start gap-4 overflow-x-scroll">
            {readLetters.length ? (
              readLetters.map((letter: Letter) => (
                <LetterPreview
                  key={letter.id}
                  template={letter.type as string}
                  text={letter.text}
                  id={letter.id}
                />
              ))
            ) : (
              <p>年賀状はありません。</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
