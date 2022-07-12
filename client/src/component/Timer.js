import { useState, useEffect } from "react";
import dayjs from "dayjs";

const Timer = (props) => {
  const timeout = 1000;

  const [remTime, setRemTime] = useState();

  const handleTimeOut = () => {
    let now = dayjs();
    let exp = dayjs(props.expiration);
    let rem = Math.floor(exp.diff(now) / 1000);
    rem = rem < 0 ? 0 : rem;

    setRemTime(rem);
  };

  useEffect(() => {
    let timer = setTimeout(() => handleTimeOut(), timeout);
    return () => {
      clearTimeout(timer);
    };
  }, [remTime]);

  useEffect(() => handleTimeOut, []);

  if (props.expiration)
    return (
      <p>
        {Math.floor(remTime / 60)
          .toString()
          .padStart(2, "0") +
          " : " +
          (remTime % 60).toString().padStart(2, "0")}
      </p>
    );
};

export default Timer;
