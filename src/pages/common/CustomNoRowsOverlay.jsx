import NotFound from "../../components/NotFound/NotFound";
import { CircularLoader } from "./CircularLoader";

export const CustomNoRowsOverlay = (loader, data, module, showImage=true) => {
  if (loader) {
    return <CircularLoader />;
  } else if (loader === false && !data.length) {
    return <NotFound value={`No ${module} found`} showImage={showImage} />;
  } else if (!data.length || data.length <= 0) {
    return <NotFound value={`No ${module} found`} showImage={showImage} />;
  } else {
    return;
  }
};
