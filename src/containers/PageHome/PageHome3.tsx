import React from "react";
import clsx from "clsx";
import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionGridAuthorBox from "components/SectionGridAuthorBox/SectionGridAuthorBox";
// import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionMainSlider from "components/SectionMainSlider/SectionMainSlider";
import SectionMainHeader from "components/SectionMainHeader/SectionMainHeader";
import SectionSliderCollections2 from "components/SectionSliderCollections2";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import SectionLargeSlider from "./SectionLargeSlider";
import { Helmet } from "react-helmet";
import frameImg from 'images/vector.svg';

function PageHome3() {
  return (
    <>
      <Helmet>
        <title>Home || Rize2Day </title>
      </Helmet>


      <div className="nc-PageHome3 relative overflow-x-clip">
        <div className="relative">
          {/* <SectionMainHeader /> */}
          <SectionMainSlider />
        </div>
        <div className="relative space-y-24 mt-8 mb-24 lg:space-y-32 lg:mb-32">
          <div className="relative py-10 lg:py-12">
            <div className="container">
              <BackgroundSection />
              <SectionHowItWork />
            </div>
          </div>
          {/* <div className="relative py-10 lg:py-12">
            <div className="container">
              <BackgroundSection />
              <SectionBecomeAnAuthor />
              <SectionHowItWork />
            </div>
          </div> */}

          <div className="relative">
            <div className={clsx("absolute bg-[#33FF00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full bottom-0 -right-[120px]")}></div>
            <div className="container py-10 px-3">
              <BackgroundSection />
              <SectionLargeSlider />
            </div>
          </div>

          <div className="relative">
            <div className={clsx("absolute bg-[#33FF00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full -top-[100px] -left-[120px] z-0")}></div>
            <img className="absolute w-full right-0 bottom-0 opacity-5" src={frameImg} alt="" />

            <div className="container">
              <SectionGridAuthorBox
                sectionStyle="style2"
                data={Array.from("11111111")}
                boxCard="box4"
              />
            </div>
          </div>

          <div className="container relative py-10 lg:py-12">
            <BackgroundSection />
            <SectionSliderCollections2 />
          </div>

          <div className="relative py-10 lg:py-12">
            <div className="container">
              <BackgroundSection />
              <SectionSliderCategories />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageHome3;
