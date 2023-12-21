import Part from "./Part";
import Header from "./Header";
import Total from "./Total";

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      {course.parts.map((part, index) => (
        <Part part={part} key={index} />
      ))}
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
