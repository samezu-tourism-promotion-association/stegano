import templates from "@/lib/templates";
import Image from "next/image";
import nl2br from "react-nl2br";

export default function Letter({
  template,
  text,
}: {
  template: string;
  text: string | undefined;
}) {
  return (
    <div className="relative max-w-80 w-full aspect-[1/1.49]" id="letter">
      <Image
        src={templates[template]}
        layout="fill"
        objectFit="cover"
        alt="Letter Preview"
      />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-1 p-5 bg-black bg-opacity-50 text-white writing-vertical">
        <p className="text-lg font-bold">{template}</p>
        <p className="text-lg">{nl2br(text)}</p>
      </div>
    </div>
  );
}
