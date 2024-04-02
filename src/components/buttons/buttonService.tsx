"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import { Dispatch, SetStateAction } from "react";

interface IButtonServiceProps {
  image: StaticImageData;
  serviceName: string;
  setWallet?: Dispatch<SetStateAction<string>>;
}

function ButtonService({
  image,
  serviceName,
  setWallet,
}: IButtonServiceProps) {
  const handleClick = () => {
    if (setWallet) {
      setWallet(serviceName);
    }
  };

  return (
    <li
      data-active="false"
      onMouseDown={handleClick}
      className="btnService flex gap-4 items-center justify-start rounded-[7px] bg-[var(--color-cards)] w-full h-[50px] px-[10px]"
      style={{ minHeight: "50px", transition: ".3s" }}
    >
      <Image
        src={image}
        alt="image_service"
        width={34}
        height={34}
        className="rounded-[3px]"
      />
      <p style={{ transition: ".3s" }}>{serviceName}</p>
    </li>
  );
}

export default React.memo(ButtonService);
