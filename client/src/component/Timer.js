import { useState, useEffect } from "react";
import dayjs from "dayjs";

const Timer = (props) => {
  const timeout = 1000;
  const [remTime, setRemTime] = useState();

  const handleTimeOut = () => {
    if (props.riddle.expiration) {
      let now = dayjs();
      let exp = dayjs(props.riddle.expiration);
      let rem = Math.floor(exp.diff(now) / 1000);
      if (rem < 0) {
        API.UpdateStateByRid(props.riddle.rid, "expire");
        setRemTime(0);
        props.setUpdate(true);
      } else setRemTime(rem);
    } else {
      setRemTime(0);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => handleTimeOut(), timeout);
    return () => {
      clearTimeout(timer);
    };
  }, [remTime]);

  useEffect(() => {
    handleTimeOut();
  });

  if (props.riddle.expiration)
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
