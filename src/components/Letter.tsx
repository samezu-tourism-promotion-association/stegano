import Link from "next/link";
import { RiStickyNoteAddLine } from "react-icons/ri";

export default function Letter({
  blank = false,
  image,
  title,
}: {
  blank?: boolean;
  image?: string;
  title?: string;
}) {
  return blank ? (
    <Link
      href="/write"
      className="shrink-0 w-full block aspect-[5/6] max-w-60 bg-primary/60 rounded-lg"
    >
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <RiStickyNoteAddLine color="white" size={60} />
        <p className="text-white text-xl">年賀状をつくる</p>
      </div>
    </Link>
  ) : (
    <Link className="shrink-0 block" href="/letters/1">
      <img
        src={image}
        alt={title}
        className="aspect-[5/6] w-full max-w-60 object-cover rounded-lg"
      />
      <p className="mt-2 text-lg text-center text-black">{title}</p>
    </Link>
  );
}
