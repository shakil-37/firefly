const PostDateConvert = (props) => {
  //

  const differenceInMilliseconds = Date.now() - props.createdDate;

  // Convert to seconds
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  const seconds = differenceInSeconds % 60;
  const minutes = Math.floor((differenceInSeconds % 3600) / 60);
  const hours = Math.floor(differenceInSeconds / 3600);
  let timeString = "";
  if (hours > 0) {
    timeString += `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    if (timeString.length > 0) {
      timeString += " "; // Add space as separator
    }
    timeString += `${minutes} min${minutes > 1 ? "s" : ""}`;
  }

//   if (seconds > 0 && (hours === 0 || minutes === 0)) {
//     if (timeString.length > 0) {
//       timeString += " "; // Add space as separator
//     }
//     timeString += `${seconds} sec${seconds > 1 ? "s" : ""}`;
//   }

  // Add "ago" for past tense
  timeString += " ago";

  return timeString;
};

export default PostDateConvert;
