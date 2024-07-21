"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function PageHeader({ text, backButtonHref }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {backButtonHref && (
        <Link href={backButtonHref} className=" self-center">
          <Button
            variant="ghost"
            className="pl-0 py-1 pr-1 hover:bg-transparent"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </Button>
        </Link>
      )}
      <h1 className="text-3xl md:text-4xl text-left">{text}</h1>
    </div>
  );
}
