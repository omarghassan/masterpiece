import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import NotFound from "./Components/404PageNotFound/NotFound";

// Main site Imports
import LandingPage from "./Components/MainSite/Landing";

// Instructor Components Imports
import InstructorLogin from "./Components/Instructors/Auth/Login";
import InstructorProfile from "./Components/Instructors/Profile";
import InstructorAllCourses from "./Components/Instructors/Courses/Index";
import InstructorCreateCourse from "./Components/Instructors/Courses/Create";
import InstructorEditCourse from "./Components/Instructors/Courses/Edit";
import InstructorViewCourse from "./Components/Instructors/Courses/View";
import InstructorAllBlogs from "./Components/Instructors/Blogs/Index";
import InstructorViewBlog from "./Components/Instructors/Blogs/View";
import InstructorCreateBlog from "./Components/Instructors/Blogs/Create";
import InstructorEditBlog from "./Components/Instructors/Blogs/Edit";

// Admin Components Imports
import AdminLogin from "./Components/Admins/Auth/Login";
import AdminHome from "./Components/Admins/AdminHomePage";
import AdminProfile from "./Components/Admins/AdminProfile";
import AdminViewAllUsers from "./Components/Admins/Users/Index";
import AdminUserEdit from "./Components/Admins/Users/Edit";

import AdminUserDetails from "./Components/Admins/Users/View";
import AdminInstructorDetails from "./Components/Admins/Instructors/View";
import AdminViewAllInstructors from "./Components/Admins/Instructors/Index";
import AdminInstructorEdit from "./Components/Admins/Instructors/Edit";
import AdminViewAllSubscriptions from "./Components/Admins/Subscriptions/Index";
import AdminViewAllBlogs from "./Components/Admins/Blogs/Index";
import AdminViewAllCourses from "./Components/Admins/Courses/Index";

function App() {
  return (
    <Router>
      <div>
        <Routes>

          <Route path="/" element={<LandingPage />}></Route>

          {/* Instructor Routes */}
          <Route path="/instructor/login" element={<InstructorLogin />}></Route>
          <Route path="/instructor/profile" element={<InstructorProfile />}></Route>

          {/* Instructor Courses Routes */}
          <Route path="/instructor/courses" element={<InstructorAllCourses />}></Route>
          <Route path="/instructor/courses/view/:id" element={<InstructorViewCourse />}></Route>
          <Route path="/instructor/courses/create" element={<InstructorCreateCourse />}></Route>
          <Route path="/instructor/courses/edit/:id" element={<InstructorEditCourse />}></Route>

          {/* Instructor Blogs Routes */}
          <Route path="/instructor/blogs" element={<InstructorAllBlogs />}></Route>
          <Route path="/instructor/blogs/view/:id" element={<InstructorViewBlog />}></Route>
          <Route path="/instructor/blogs/create" element={<InstructorCreateBlog />}></Route>
          <Route path="/instructor/blogs/edit/:id" element={<InstructorEditBlog />}></Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route path="/admin/home" element={<AdminHome />}></Route>
          <Route path="/admin/profile" element={<AdminProfile />}></Route>
          <Route path="/admin/users" element={<AdminViewAllUsers />}></Route>
          <Route path="/admin/users/view/:id" element={<AdminUserDetails />}></Route>
          <Route path="/admin/users/edit/:id" element={<AdminUserEdit />}></Route>
          <Route path="/admin/instructors" element={<AdminViewAllInstructors />}></Route>
          <Route path="/admin/instructors/view/:id" element={<AdminInstructorDetails />}></Route>
          <Route path="/admin/instructors/edit/:id" element={<AdminInstructorEdit />}></Route>
          <Route path="/admin/subscriptions" element={<AdminViewAllSubscriptions />}></Route>
          <Route path="/admin/blogs" element={<AdminViewAllBlogs />}></Route>
          <Route path="/admin/courses" element={<AdminViewAllCourses />}></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
