import Layout from "@/layouts/Layout";
import { NextSeo } from "next-seo";
import Header from "@/components/Header";
import Letter from "@/components/LetterPreview";
import Footer from "@/components/Footer";
import { getCookie } from "cookies-next/server";
import { GetServerSideProps } from 'next';

interface HomeProps {
  token: string | null;
}

export default function Home({ token }: HomeProps) {
  const letters:Letter[] = token ? JSON.parse(token) : [];

  return (
    <Layout>
      <NextSeo title="ステ賀乃" />
      <Header home />
      <main className="max-w-4xl mx-auto px-4 pb-16 text-primary">
        <div className="pt-12">
          <h2 className="text-2xl font-bold">つくった年賀状</h2>
          <div className="mt-8 flex items-start gap-4 overflow-x-scroll">
            {letters.length ? (
              letters.map((letter: Letter) => (
                <Letter
                  key={letter.id}
                  type={letter.type as unknown as number }
                  text={letter.text}
                  id={letter.id}
                />
              ))
            ) : (
              <p>年賀状はありません。</p>
            )}
          </div>
        </div>
        <div className="pt-12">
          <h2 className="text-2xl font-bold">読んだ年賀状</h2>
          <div className="mt-8 flex items-start gap-4 overflow-x-scroll">
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = await getCookie("created", { req: context.req, res: context.res });
  console.log(cookie);
  return {
    props: {
      token: cookie ?? null,
    },
  };
}
