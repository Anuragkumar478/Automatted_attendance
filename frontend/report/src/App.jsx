import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Student from "./pages/Student";
import StudentProfile from "./pages/StudentProfile";
import Attendence from "./pages/Attendence";
import StudentAttendance from "./pages/StudentAttendance";
import Labs from "./pages/Labs";
import Marks from "./pages/Marks"
import Projects from "./pages/Projects";
import Register from "./pages/Register";
import TeacherRegister from "./pages/teacherRegister";
import Login from "./pages/Login";
import Subjects from "./pages/Subjects";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
           <Route path="/student" element={<Student/>} />
            <Route path="/student/:id" element={<StudentProfile/>} />
             <Route path="/attendance" element={<Attendence/>} />
             <Route path="/studentAttendance" element={<StudentAttendance/>} />
              <Route path="/labs" element={<Labs/>} />
              <Route path="/marks" element={<Marks/>}/>
               <Route path="/projects" element={<Projects/>} />
               <Route path="/register" element={<Register/>}/>
<Route path="/teacherRegister" element={<TeacherRegister/>}/>
 <Route path="/login" element={<Login/>}/>
 <Route path="/subjects" element={<Subjects/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
