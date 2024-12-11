import templates from "@/lib/templates";
import Image from "next/image";
import nl2br from "react-nl2br";
import { twMerge } from "tailwind-merge";

export default function Letter({
  template,
  text,
}: {
  template: string;
  text: string | undefined;
}) {
  const isHalfTemplate = () => {
    const halfTemplates = ["#S3", "#T3"];
    return halfTemplates.includes(template);
  };
  return (
    <div className="relative max-w-80 w-full aspect-[1/1.49]" id="letter">
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
        <p className="text-lg font-bold">{template}</p>
        <p className="text-lg">{nl2br(text)}</p>
      </div>
    </div>
  );
}
