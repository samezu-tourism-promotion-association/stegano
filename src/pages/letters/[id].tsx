import {usePdf} from '@/hooks/usePdf'
import Letter from '@/components/LetterPreview'
import { useParams } from 'next/navigation'
import Button from '@/components/Button'
import { GetServerSideProps } from 'next'
import { getCookie } from "cookies-next/server";

export default function LetterPage({ token }: { token: string }) {
    const { id } = useParams()
    const {targetRef, pdfOpenHandler} = usePdf()
    const letters:Letter[] = token ? JSON.parse(token) : []
    const letter = letters.find((letter) => letter.id === id)
    return (
      <>
        <div ref={targetRef}>
            {
                letter ? (
                    <Letter
                        key={letter.id}
                        type={letter.type as unknown as number }
                        text={letter.text}
                        id={letter.id}
                    />
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
  const cookie = await getCookie("created", { req: context.req, res: context.res });
  console.log(cookie);
  return {
    props: {
      token: cookie ?? null,
    },
  };
}
