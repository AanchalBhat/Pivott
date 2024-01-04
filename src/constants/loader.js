export const loader = (load) => {
  var x = document?.getElementById("loading");
  if (x) {
    if (load) {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
};
