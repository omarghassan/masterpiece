import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import InstructorLogin from "./Components/Instructors/Auth/Login";
import Profile from "./Components/Instructors/Profile";
import Footer from "./Components/Layouts/Instructors/Footer";
import InstructorSidebar from "./Components/Layouts/Instructors/Sidebar";
import Navbar from "./Components/Layouts/Instructors/Navbar";
import AllCourses from "./Components/Instructors/Courses/Index";
import NotFound from "./Components/404PageNotFound/NotFound";
import InstructorCreateCourse from "./Components/Instructors/Courses/Create";
import InstructorEditCourse from "./Components/Instructors/Courses/Edit";
import InstructorViewCourse from "./Components/Instructors/Courses/View";
import InstructorAllBlogs from "./Components/Instructors/Blogs/Index";
import InstructorViewBlog from "./Components/Instructors/Blogs/View";
import InstructorCreateBlog from "./Components/Instructors/Blogs/Create";
import InstructorEditBlog from "./Components/Instructors/Blogs/Edit";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={<></>}></Route> */}
          <Route path="/instructor/login" element={<InstructorLogin />}></Route>
          <Route path="/instructor/profile" element={<Profile />}></Route>
          <Route path="/instructor/courses" element={<AllCourses />}></Route>
          <Route path="/instructor/courses/view/:id" element={<InstructorViewCourse />}></Route>
          <Route path="/instructor/courses/create" element={<InstructorCreateCourse />}></Route>
          <Route path="/instructor/courses/edit/:id" element={<InstructorEditCourse />}></Route>

          {/* Instructor Blogs Routes */}
          <Route path="/instructor/blogs" element={<InstructorAllBlogs />}></Route>
          <Route path="/instructor/blogs/view/:id" element={<InstructorViewBlog />}></Route>
          <Route path="/instructor/blogs/create" element={<InstructorCreateBlog />}></Route>
          <Route path="/instructor/blogs/edit/:id" element={<InstructorEditBlog />}></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        {/* <Navbar /> */}
        {/* <InstructorSidebar /> */}
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
