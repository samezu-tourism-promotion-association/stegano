import Link from "next/link";

export default function Letter({
    type,
    text,
    id
}: {
    type: number;
    text: string;
    id: string;
}) {
  return(
    <Link className="shrink-0 block p-4 bg-gray-100" href={`/letters/${id}`}>
        <div className="aspect-[5/6] w-full max-w-60 object-cover rounded-lg"/>
        <p className="mt-2 text-lg text-center text-black">{type}</p>
        <p className="mt-2 text-lg text-center text-black">{text.slice(0, 10)}{text.length > 10 ? '...' : ''}</p>
    </Link>
  );
}
