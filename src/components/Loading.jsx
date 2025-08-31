import React from "react";
import { useLoading } from "../context/LoadingContext";
import "../css/Loader.css";

function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed left-0 top-0 z-50 block h-full w-full bg-black-dark-500 opacity-75 dark:bg-opacity-99">
      <span className="r-4 relative top-1/2 mx-auto my-0 block h-0 w-0 text-main_color">
        <div role="status">
          <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div className="container w-[307px] h-[50px]">
              <div className="content relative overflow-hidden font-sans font-bold text-[35px] leading-[40px] text-secondary">
                <div className="content__container relative h-[40px] overflow-hidden px-15 font-semibold">
                  <p className="content__container__text inline float-left">
                    Be
                  </p>
                  <ul className="content__container__list relative mt-0 list-none pl-12 text-left animate-change">
                    <li className="content__container__list__item leading-[40px]">
                      focused!
                    </li>
                    <li className="content__container__list__item leading-[40px]">
                      informed!
                    </li>
                    <li className="content__container__list__item leading-[40px]">
                      patient!
                    </li>

                    <li className="content__container__list__item leading-[40px]">
                      humble!
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    </div>
  );
}

export default Loading;
