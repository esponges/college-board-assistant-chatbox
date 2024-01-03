/* eslint-disable max-len */
import { useCallback, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import type { BgColor } from "@/app/types/enums";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  outerCloseBtn?: boolean;
  innerCloseBtn?: boolean;
  title?: string;
  showActions?: boolean;
  bgColor?: BgColor | string;
  maxWidth?: string;
};

const MODAL_WRAPPER = "modal__wrapper";

// todo: close modal on outside click
export const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  showActions,
  bgColor,
  outerCloseBtn,
  innerCloseBtn,
  maxWidth = "md:max-w-5xl lg:min-w-[40%]",
}: Props) => {

  const checkOutsideClick = useCallback((e: MouseEvent) => {
    const HTMLTarget = e.target as HTMLElement;

    // hack - I'm not sure why the listed classes are only available on the outer div
    // but not the inner div. The initial solution had an useRef added to the wrapper
    // and was checking if the target was the wrapper or the inner div.
    if (HTMLTarget.classList.contains(MODAL_WRAPPER )) {
      onClose();
    }

  }, [onClose]);

  // close modal on outside click
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener("click", checkOutsideClick);
    }

    return () => {
      if (!isOpen) return;
      document.body.removeEventListener("click", checkOutsideClick);
    };
  }, [onClose, isOpen, checkOutsideClick]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[102] 
        flex items-center justify-center 
        overflow-y-auto overflow-x-hidden 
        outline-none focus:outline-none ${MODAL_WRAPPER}`}
      >
        <div className={twMerge("relative mx-auto my-6 w-auto", maxWidth)}>
          {/* close btn */}
          {(outerCloseBtn || innerCloseBtn) && (
            <button
              className={`absolute ${
                outerCloseBtn ? "-right-6 -top-6" : "right-2 top-0 z-[103]"
              }
              border-0 bg-transparent p-1 text-3xl font-semibold
              leading-none opacity-50`}
              onClick={onClose}
            >
              <span className="h-6 w-6 bg-transparent text-2xl text-white outline-none focus:outline-none ">
                ×
              </span>
            </button>
          )}
          {/* content */}
          <div
            className={`relative flex w-full flex-col rounded-lg border-0 ${
              bgColor ?? "bg-white"
            } shadow-lg outline-none focus:outline-none`}
          >
            {/* header */}
            {title && (
              <div
                className={`
              modal__header border-blueGray-200 flex 
              items-start items-center justify-center justify-between
              rounded-t ${title ? "border-b border-solid" : ""} p-5`}
              >
                <h6 className="mb-0 font-semibold">{title}</h6>
                <button
                  className="float-right ml-auto border-0
                bg-transparent p-1 text-3xl
                font-semibold leading-none text-black
                opacity-75 outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="h-6 w-6 bg-white text-2xl text-black outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                {/* outside div x close btn */}
              </div>
            )}
            {/* body */}
            <div>
              <div className="text-blueGray-500 my-4 text-lg leading-relaxed">
                {children}
              </div>
            </div>
            {/* actions */}
            {showActions && (
              <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                <button
                  className="mb-1 mr-1 rounded bg-red-500 px-6
                py-3 text-sm font-bold uppercase text-white shadow outline-none 
                transition-all duration-150 ease-linear 
                hover:shadow-lg focus:outline-none active:bg-red-600"
                  type="button"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-[101] bg-black opacity-25" />
    </>
  );
};
