import Link from "next/link";
import {
  RiStickyNoteAddLine,
  RiCamera3Line,
  RiSettings3Line,
  RiArrowLeftSLine,
} from "react-icons/ri";

export default function Header({
  home = false,
  title,
  back,
}: {
  home?: boolean;
  title?: string;
  back?: string;
}) {
  return home ? (
    <header className="bg-primary text-white flex flex-col items-center justify-between w-full max-w-4xl px-4 py-8 mx-auto md:px-8">
      <Link href="/" className="text-5xl font-bold">
        ステ賀乃
      </Link>
      <input
        type="text"
        placeholder="つくった年賀状をさがす"
        className="w-full py-2 px-4 text-black bg-white focus:ring-primary focus:border-primary mt-6 rounded-full"
      />
      <nav className="flex items-center max-w-60 w-full justify-between mt-6">
        <Link href="/write" className="flex flex-col items-center gap-1">
          <RiStickyNoteAddLine size={32} />
          <p>つくる</p>
        </Link>
        <Link href="/read" className="flex flex-col items-center gap-1">
          <RiCamera3Line size={32} />
          <p>よむ</p>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1">
          <RiSettings3Line size={32} />
          <p>設定</p>
        </Link>
      </nav>
    </header>
  ) : (
    <header className="bg-primary text-white flex items-center gap-2 p-4 mx-auto w-full max-w-4xl">
      <Link href={back || "/"}>
        <RiArrowLeftSLine size={36} />
      </Link>
      <p className="text-2xl font-bold">{title || "ステ賀乃"}</p>
    </header>
  );
}
