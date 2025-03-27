import "animate.css";
import TrackVisibility from "react-on-screen";

const Features = ({ title, title1, desc, btnTitle, btnAction, imgSource }) => {
  return (
    <section
      id="features"
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full"
    >
      {/* Left Section - Text */}
      <div className="flex flex-col justify-center items-start w-full p-6">
        <h2 className="text-7xl capitalize font-bold">
          <span className="relative z-10 pr-3">{title}</span>
          <span className="text-main_color">{title1}</span>
        </h2>
        <p className="mt-4 text-lgtext-gray-600">{desc}</p>
      </div>

      {/* Right Section - Image */}
      <TrackVisibility partialVisibility once>
        <div className="relative flex justify-center items-center w-full p-6 overflow-hidden">
          <img
            src={imgSource}
            alt="TradeTact"
            className="object-contain rounded-lg max-w-full max-h-full transition-transform duration-500 ease-in-out transform hover:scale-110"
          />
        </div>
      </TrackVisibility>
    </section>
  );
};

export default Features;
