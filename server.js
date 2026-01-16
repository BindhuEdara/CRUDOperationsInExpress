import fs from "fs";
import express from "express"

const app = express();
app.use(express.json());

app.get("/students", (req, res) => {
  let rawData = fs.readFileSync("./db.json", "utf-8")
  let parsedData = JSON.parse(rawData)
  let students = parsedData.students
  res.json({ message: "Students Data" , data: students });
})

app.post("/students", (req, res) => {
   let rawData = fs.readFileSync("./db.json", "utf-8");
   let parsedData = JSON.parse(rawData);
   let students = parsedData.students; 
   let newId = students[students.length - 1].id + 1;
   let newStudent = {
     id: students.length > 0 ? newId : 1,
     name: req.body.name,
     course: req.body.course,
     year: req.body.year,
   };
   students.push(newStudent); ///4.
   /// Before pushing into db.json, stringify the data
   let stringiffiedData = JSON.stringify(parsedData);
   fs.writeFileSync("./db.json", stringiffiedData);
   res.json({ message: "Todo added", student: newStudent });
})


app.put("/students", (req, res) => {

  // 1. Read data from db.json
  const rawData = fs.readFileSync("./db.json", "utf-8");
  const parsedData = JSON.parse(rawData);
  const students = parsedData.students;

  // 2. Get data from request body
  const { id, name, course, year } = req.body;

  // 3. Find student by id
  const studentIndex = students.findIndex(
    (student) => student.id === id
  );

  // 4. If student not found
  if (studentIndex === -1) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  // 5. Update only provided fields
  if (name) students[studentIndex].name = name;
  if (course) students[studentIndex].course = course;
  if (year) students[studentIndex].year = year;

  // 6. Save updated data to db.json
  fs.writeFileSync(
    "./db.json",
    JSON.stringify(parsedData, null, 2)
  );

  // 7. Send response
  res.json({
    message: "Student updated successfully",
    student: students[studentIndex]
  });
});


app.delete("/students/:id", (req, res) => {
  // 1. Read data from db.json
  const rawData = fs.readFileSync("./db.json", "utf-8");
  const parsedData = JSON.parse(rawData);
  const students = parsedData.students;

  // 2. Get id from URL params
  const studentId = Number(req.params.id);

  // 3. Find student index
  const studentIndex = students.findIndex(
    (student) => student.id === studentId
  );

  // 4. If student not found
  if (studentIndex === -1) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  // 5. Remove student from array
  const deletedStudent = students.splice(studentIndex, 1);

  // 6. Save updated data to db.json
  fs.writeFileSync("./db.json", JSON.stringify(parsedData, null, 2));

  // 7. Send response
  res.json({
    message: "Student deleted successfully",
    student: deletedStudent[0],
  });
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
})
