"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function PageHeader({ text, backButtonHref }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {backButtonHref && (
        <Link href={backButtonHref} className=" self-center">
          <Button variant="ghost" className="p-1 hover:bg-transparent">
            <ArrowLeft size={24} strokeWidth={2} />
          </Button>
        </Link>
      )}
      <h1 className="text-2xl md:text-3xl text-left">{text}</h1>
    </div>
  );
}
