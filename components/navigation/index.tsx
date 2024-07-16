"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <>
      <div className="p-4 fixed top-0 left-0 right-0 z-20 flex items-center justify-between before:block before:w-full before:h-full before:absolute before:top-0 before:left-0 before:opacity-10 before:z-[-200] backdrop-blur-md">
        <aside className="flex items-center gap-2">
          <Image
            src={"/assets/random.png"}
            width={40}
            height={40}
            alt="sassy-logo"
          />

          <div className="w-60 flex justify-evenly items-center">
            <span className="text-xl font-bold">Company</span> /
            <span className="text-md font-medium">Ad title</span>/
            <span className="text-sm">all</span>
          </div>
        </aside>

        <aside className="flex gap-2 items-center">
          <Image
            src="https://avatar.iran.liara.run/public"
            width={40}
            height={40}
            alt="user photo"
          />
        </aside>
      </div>
    </>
  );
};

export default Navigation;
