import {usePdf} from '@/hooks/usePdf'
import Letter from '@/components/LetterPreview'
import { useParams } from 'next/navigation'
import Button from '@/components/Button'
import { GetServerSideProps } from 'next'
import { getCookie } from "cookies-next/server";

export default function LetterPage({ letter }: { letter: Letter }) {
    const {targetRef, pdfOpenHandler} = usePdf()
    return (
      <>
        <div ref={targetRef}>
            {
                letter ? (
                    <div>
                      {letter.encoded}
                      {letter.text}
                    </div>
                ) : (
                    <p>年賀状はありません。</p>
                )
            }
        </div>
        <Button text="PDFを開く" onClick={pdfOpenHandler} />
      </>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  const createdCookie = await getCookie("created", { req: context.req, res: context.res });
  const createdLetters: Letter[] = createdCookie ? JSON.parse(createdCookie as string) : [];
  let letter = createdLetters.find((letter) => letter.id === id);
  if (!letter) {
    const readCookie = await getCookie("read", { req: context.req, res: context.res });
    const readLetters: Letter[] = readCookie ? JSON.parse(readCookie as string) : [];
    letter = readLetters.find((letter) => letter.id === id);
  }

  return {
    props: {
      letter: letter || null,
    },
  };
};
