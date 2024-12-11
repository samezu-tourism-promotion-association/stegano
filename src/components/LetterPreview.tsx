import Link from "next/link";
import templates from "@/lib/templates";
import Image from "next/image";
import nl2br from "react-nl2br";
import { twMerge } from "tailwind-merge";

export default function LetterPreview({
  template,
  text,
  id,
}: {
  template: string;
  text: string | undefined;
  id: string;
}) {
  const isHalfTemplate = () => {
    const halfTemplates = [""];
    return halfTemplates.includes(template);
  };
  return (
    <Link className="shrink-0 block max-w-60 w-full" href={`/letters/${id}`}>
      <div className="relative max-w-60 w-full aspect-[1/1.49]" id="letter">
        <Image
          src={templates[template]}
          layout="fill"
          objectFit="cover"
          alt="Letter Preview"
        />
        <div
          className={twMerge(
            "absolute left-0 w-full h-full flex flex-col gap-1 p-5 writing-vertical",
            ["#T3", "#S3"].includes(template) ? "text-black" : "text-white",
            isHalfTemplate() ? "top-1/2 h-1/2" : "top-0 h-full"
          )}
        >
          <p className="text-sm font-bold">{template}</p>
          <p className="text-sm">{nl2br(text)}</p>
        </div>
      </div>
    </Link>
  );
}
