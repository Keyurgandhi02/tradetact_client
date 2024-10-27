import React from "react";

function ProfileCardItem({ icon, title, viewModalHandler }) {
  return (
    <div
      class="h-44 w-42 border-[0.6px] border-gray-500 shadow-soft-xl rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-light_hover_color dark:hover:bg-main_black_bg"
      onClick={() => viewModalHandler(true, title)}
    >
      {icon}
      <span class="mt-6 text-md leading-5 font-semibold text-center  text-black-dark-400 dark:text-whiten">
        {title}
      </span>
    </div>
  );
}

export default ProfileCardItem;
