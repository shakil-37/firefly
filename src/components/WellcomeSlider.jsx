import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import sliderChatting from "../images/sliderChatting.png";
import sliderFriend from "../images/sliderFriend.png";
import sliderGlarry from "../images/sliderGlarry.png";
import sliderPost from "../images/sliderPost.png";
//
const WellcomeSlider = () => {
  let sliderData = [sliderChatting, sliderFriend, sliderGlarry, sliderPost];
  //
  return (
    <div>
      <Carousel
        additionalTransfrom={0}
        autoPlay={true}
        autoPlaySpeed={3000}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 3,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {sliderData.map((image, i) => {
          return (
            <div key={i} className="border-[1px] border-third rounded-md">
              <img src={image} alt="slider-img" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default WellcomeSlider;
