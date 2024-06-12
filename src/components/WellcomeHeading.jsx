import React from "react";
import TextTransition, { presets } from "react-text-transition";
//
const WellcomeHeading = () => {
  //
  const [index, setIndex] = React.useState(0);
  const TEXTS = ["Lets connect", "Some friends and family", "Also share and chat", "Your mind"];
  //
  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  //
  return (
    <TextTransition inline={true} springConfig={presets.wobbly}>
      {TEXTS[index % TEXTS.length]}
    </TextTransition>
  );
};

export default WellcomeHeading;
