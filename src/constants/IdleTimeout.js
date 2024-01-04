import { useIdleTimer } from "react-idle-timer";

export default function IdleTimeout({ logOut }) {
  const onIdle = () => {
    logOut();
  };

  useIdleTimer({
    onIdle,
    timeout: 1 * 60 * 60 * 1000, // idle timeout for 1 hr in milliseconds
    throttle: 500,
  });
  return <></>;
}
