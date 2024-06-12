import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
//
const Test = () => {
  //
  return (
    <div>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
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
            items: 1,
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
        <div>
          <h2 className="text-black">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias
            inventore maiores, repellat quos labore voluptas ipsa corporis
            molestias adipisci fugit.
          </h2>
        </div>
        <div>
          <h2 className="text-black">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias
            inventore maiores, repellat quos labore voluptas ipsa corporis
            molestias adipisci fugit.
          </h2>
        </div>
        <div>
          <h2 className="text-black">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias
            inventore maiores, repellat quos labore voluptas ipsa corporis
            molestias adipisci fugit.
          </h2>
        </div>
        <div>
          <h2 className="text-black">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias
            inventore maiores, repellat quos labore voluptas ipsa corporis
            molestias adipisci fugit.
          </h2>
        </div>
      </Carousel>
    </div>
  );
};

export default Test;
