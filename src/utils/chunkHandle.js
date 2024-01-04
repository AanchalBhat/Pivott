import { CircularProgress } from "@material-ui/core";

//handling chunk err in lazy load
export const lazyRetry = function (componentImport, name) {
  return new Promise((resolve, reject) => {
    const storageKey = `retry-lazy-refreshed-${name}`;
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem(storageKey) || "false"
    );
    componentImport()
      .then((component) => {
        window.sessionStorage.setItem(storageKey, "false");
        resolve(component);
      })
      .catch((error) => {
        if (!hasRefreshed) {
          // not been refreshed yet
          window.sessionStorage.setItem(storageKey, "true");
          return window.location.reload(); // refresh the page
        }
        reject(error);
        console.log(error);
      });
  });
};
//suspend loader of lazy
export const renderLazyLoader = () => {
  return (
    <>
      <div className="lazy_loader_div">
        <span className="text-center">
          <CircularProgress style={{ color: "#2c42b5" }} />
          <div className="loader_text">
            <h5>Loading</h5>
          </div>
        </span>
      </div>
    </>
  );
};
