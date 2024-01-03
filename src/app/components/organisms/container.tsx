import React from "react";
import { twMerge } from "tailwind-merge";

export const Container = ({
  children,
  textCenter = true,
  classNames,
}: {
  children: React.ReactNode;
  textCenter?: boolean;
  classNames?: string;
}) => {
  return (
    <div className="mx-auto max-w-7xl my-6 md:my-4 px-4 sm:px-6 lg:px-8">
      <div
        className={twMerge(
          "mx-auto max-w-3xl",
          textCenter ? "text-center" : "",
          classNames,
        )}
      >
        {children}
      </div>
    </div>
  );
};
