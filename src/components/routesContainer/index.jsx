import { Suspense } from "react";
import { renderLazyLoader } from "../../utils/chunkHandle";
// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const LazyLoader = (Component) => (props) =>
  (
    <Suspense fallback={renderLazyLoader()}>
      <Component {...props} />
    </Suspense>
  );

export default LazyLoader;
