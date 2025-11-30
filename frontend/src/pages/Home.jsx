import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Bespoke - Home</title>
        <meta
          name="description"
          content="Bespoke is your one-stop destination for trendy and affordable fashion."
        />
      </Helmet>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
