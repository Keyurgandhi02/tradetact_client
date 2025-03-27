import React from "react";
import {
  Faq,
  Features,
  Footer,
  Home,
  Services,
  Subscribe,
} from "../../components/home_sections/sections";
import NavHome from "../../components/home_sections/NavHome";

function HomeIndexPage() {
  return (
    <main className="relative">
      <NavHome />
      <section className="padding">
        <Home />
      </section>
      <section className="padding">
        <Features
          title="Journal Your Trades"
          title1="Master Your Process"
          desc="Write detailed notes for each trade, including your thought process,
          strategy, and lessons learned. Review your past trades to see what
          worked and what didn’t, helping you refine and optimize your trading
          system."
          btnTitle="Learn more"
          btnAction=""
          imgSource="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Group%2050.png?alt=media&token=59828716-fd88-409c-80f8-f7558bf9911a"
        />
      </section>

      <section className="padding">
        <Features
          title="Powerful Reporting &"
          title1="Analytics"
          desc="Uncover the insights hidden in your trades with advanced reporting tools."
          btnTitle="Learn more"
          btnAction=""
          imgSource="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Group%2050.png?alt=media&token=59828716-fd88-409c-80f8-f7558bf9911a"
        />
      </section>
      <section className="padding">
        <Features
          title="Trade Anytime, "
          title1="Anywhere"
          desc="Since your data is stored securely in the cloud, you can access your journal from any device, whether you’re at your desk or on the go. Stay connected and keep improving, wherever you are."
          btnTitle="Learn more"
          btnAction=""
          imgSource="https://firebasestorage.googleapis.com/v0/b/smk24-6f0bf.appspot.com/o/Group%2051.png?alt=media&token=e6bbdd65-7ef1-44ec-a544-f63a1ba2d8bc"
        />
      </section>

      <section className="padding">
        <Services />
      </section>

      <section className="padding-x sm:py-32 py-16 w-full bg-black-dark-400">
        <Subscribe />
      </section>

      <section className="padding">
        <Faq />
      </section>

      {/* <section className="bg-pale-blue padding">
      <CustomerReviews />
    </section> */}

      <section className="padding bg-white padding-x padding-y pb-8">
        <Footer />
      </section>
    </main>
  );
}

export default HomeIndexPage;
