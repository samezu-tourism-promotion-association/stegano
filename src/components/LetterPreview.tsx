import Link from "next/link";
import templates from "@/lib/templates";
import Image from "next/image";
import nl2br from "react-nl2br";

export default function LetterPreview({
  template,
  text,
  id,
}: {
  template: string;
  text: string | undefined;
  id: string;
}) {
  return (
    <Link className="shrink-0 block max-w-60 w-full" href={`/letters/${id}`}>
      <div className="relative max-w-60 w-full aspect-[1/1.49]" id="letter">
        <Image
          src={templates[template]}
          layout="fill"
          objectFit="cover"
          alt="Letter Preview"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-1 p-5 bg-black bg-opacity-50 text-white writing-vertical">
          <p className="text-sm font-bold">{template}</p>
          <p className="text-sm">{nl2br(text)}</p>
        </div>
      </div>
    </Link>
  );
}
