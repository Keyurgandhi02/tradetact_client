import Button from "../../../components/home_sections/Button";
import "animate.css";
import TrackVisibility from "react-on-screen";

const Subscribe = () => {
  return (
    <TrackVisibility partialVisibility once>
      {({ isVisible }) => (
        <section
          id="contact-us"
          className={`max-container flex justify-evenly items-center max-lg:flex-col gap-10  ${
            isVisible ? "animate__animated animate__fadeIn animate__slow" : ""
          }`}
        >
          <h3 className="text-4xl leading-[68px] font-bold text-white">
            Want to be Profitable Trader ?
            <span class="block text-secondary">It&#x27;s today or never.</span>
          </h3>

          <div className="flex max-sm:justify-end items-center max-sm:w-full">
            <Button label="Sign Up" fullWidth />
          </div>
        </section>
      )}
    </TrackVisibility>
  );
};

export default Subscribe;
