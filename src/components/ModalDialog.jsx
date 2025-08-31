import React, { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CLOSE_SVG } from "../assets/svgIcons";

export default function ModalDialog({ isOpen, onClose, children }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black-dark-300 dark:bg-black-dark-500 dark:bg-opacity-85 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="p-4 relative transform overflow-hidden rounded-lg bg-whiter dark:bg-black-dark-200 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="mb-5 w-10 h-10 dark:bg-black-dark-100 bg-gray-400 flex float-right rounded-full">
                  <span
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer px-2 mt-2 dark:text-whiten text-black-dark-400 hover:text-main_red_color dark:hover:text-main_red_color"
                  >
                    <CLOSE_SVG />
                  </span>
                </div>

                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
