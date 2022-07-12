import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RiddlesTable = (props) => {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Content</th>
          <th>Difficulty</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {props.Riddles.map((r) => (
          <RiddleRow key={r.rid} riddle={r} />
        ))}
      </tbody>
    </Table>
  );
};

const RiddleRow = (props) => {
  return (
    <tr>
      <RiddleData key={props.riddle.rid} riddle={props.riddle} />
    </tr>
  );
};

const RiddleData = (props) => {
  return (
    <>
      <td>{props.riddle.content}</td>
      <td>{props.riddle.difficulty}</td>
      <td>{props.riddle.state}</td>
    </>
  );
};

export default RiddlesTable;
