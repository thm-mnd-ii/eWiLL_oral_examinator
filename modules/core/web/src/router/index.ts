import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import HomeView from "../views/ViewHome.vue";
import ViewModeling from "../views/ViewModeling.vue";
import ViewImpressum from "../views/ViewImpressum.vue";
import ViewDatenschutz from "../views/ViewDatenschutz.vue";
import ViewLogin from "../views/ViewLogin.vue";
import ViewProfile from "../views/ViewProfile.vue";
import ViewCourses from "../views/ViewCourses.vue";
import ViewCourseSignup from "../views/ViewCourseSignup.vue";
import ViewCourse from "../views/ViewCourse.vue";
import ViewTask from "../views/ViewTask.vue";
import ViewIntroduction from "../views/ViewIntroduction.vue";
import View404Page from "../views/View404Page.vue";
import FeedbackReport from "../views/ViewFeedbackReport.vue";
import FeedbackOverview from "../views/ViewFeedbackOverview.vue";
import ViewMembers from "../views/ViewMembers.vue";
import ViewTaskSubmissions from "../views/ViewTaskSubmissions.vue";
import ViewTestLogin from "@/views/oralExam/ViewTestLogin.vue";
import ViewDashStudent from "@/views/oralExam/ViewDashStudent.vue";
import ViewDashDozent from "@/views/oralExam/ViewDashDozent.vue";
import ViewCoursesDozent from "@/views/oralExam/ViewCoursesDozent.vue";
import ViewCreateExam from "@/views/oralExam/ViewCreateExam.vue";
import ViewCoursesStudent from "@/views/oralExam/ViewCoursesStudent.vue";
import ViewCreateQuestion from "@/views/oralExam/ViewCreateQuestion.vue";
import ViewExamStart from "@/views/oralExam/ViewExamStart.vue";
import ViewOralExam from "@/views/oralExam/ViewOralExam.vue";
import ViewCourseSignUpDozent from "@/views/oralExam/ViewCourseSignUpDozent.vue";
import ViewCourseSignUpStudent from "@/views/oralExam/ViewCourseSignUpStudent.vue";


import authService from "@/services/auth.service";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/modeling",
      name: "Modeling",
      component: ViewModeling,
    },
    {
      path: "/impressum",
      name: "ViewImpressum",
      component: ViewImpressum,
    },
    {
      path: "/datenschutz",
      name: "ViewDatenschutz",
      component: ViewDatenschutz,
    },
    {
      path: "/login",
      name: "ViewLogin",
      component: ViewLogin,
    },
    {
      path: "/profile",
      name: "ViewProfile",
      component: ViewProfile,
    },
    {
      path: "/course",
      name: "ViewCourses",
      component: ViewCourses,
    },
    {
      path: "/course/:id/signup",
      name: "ViewCourseSignup",
      component: ViewCourseSignup,
    },
    {
      path: "/course/:id",
      name: "ViewCourse",
      component: ViewCourse,
    },
    {
      path: "/course/:courseId/task/:taskId",
      name: "ViewTask",
      component: ViewTask,
    },
    {
      path: "/",
      name: "ViewIntroduction",
      component: ViewIntroduction,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "View404Page",
      component: View404Page,
    },
    {
      path: "/feedbackReport",
      name: "ViewBugReport",
      component: FeedbackReport,
    },
    {
      path: "/feedbackOverview",
      name: "ViewBugOverview",
      component: FeedbackOverview,
    },
    {
      path: "/course/:courseId/members",
      name: "ViewMembers",
      component: ViewMembers,
    },
    {
      path: "/course/:courseId/task/:taskId/submissions",
      name: "ViewTaskSubmissions",
      component: ViewTaskSubmissions,
      
    },

    //? ----------------- OralExam path's ------------------------
    {
      path: "/testLogin",
      name: "ViewTestLogin",
      component: ViewTestLogin,
    },
    {
      path: "/testLogin/dashStudent",
      name: "ViewDashStudent",
      component: ViewDashStudent,
    },
    {
      path: "/testLogin/dashDozent",
      name: "ViewDashDozent",
      component: ViewDashDozent,
    },
    {
      path: "/testLogin/dashDozent/coursesDozent",
      name: "ViewCoursesDozent",
      component: ViewCoursesDozent,
    },
    {
      path: "/testLogin/dashStudent/examListStudent",
      name: "ViewCoursesStudent",
      component: ViewCoursesStudent,
    },

    {
      path: "/testLogin/dashDozent/coursesDozent/:createExamId/createQuestion",
      name: "ViewCreateCourse",
      component: ViewCreateQuestion,
    },
    {
      path: "/testLogin/dashDozent/coursesDozent/:createExamId",
      name: "ViewCreateExam",
      component: ViewCreateExam,
    },
     {
    path: "/testLogin/dashStudent/examListStudent/:examId",
    name: "ViewExamStart",
    component: ViewExamStart,
    },
     {
    path: "/testLogin/dashStudent/examListStudent/:examId/:stufe",
    name: "ViewOralExam",
    component: ViewOralExam,
    },
    {
      path: "/testLogin/dashStudent/examListStudent/:id/signupStudent",
      name: "ViewCourseSignUpStudent",
      component: ViewCourseSignUpStudent,
    },

    {
      path: "/testLogin/dashDozent/coursesDozent/:id/signupDozent",
      name: "ViewCourseSignupDozent",
      component: ViewCourseSignUpDozent,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  const nonAdminPages = [
    "Home",
    "Modeling",
    "ViewImpressum",
    "ViewDatenschutz",
    "ViewLogin",
    "ViewCourses",
    "ViewCourseSignup",
    "ViewCourse",
    "ViewTask",
    "ViewIntroduction",
    "View404Page",
    "FeedbackReport",
    "ViewMembers",
    "ViewTaskSubmissions",
    //? --------------------------- OralExam Views ------------------------------
    "ViewTestLogin",
    "ViewDashStudent",
    "ViewCoursesDozent",
    "ViewCoursesStudent",   
    "DialogCreateCourse",   
    "ViewDashDozent",       
    "ViewBugReport",
    "ViewBugOverview",
    "CoursesListDozent",
    "ViewExamStart",  
    "ViewOralExam"
  ];
  const adminRequired = !nonAdminPages.includes(to.name as string);
  const role = localStorage.getItem("role");
  const admin = role?.includes("ADMIN");

  const loginValid = await authService.isValid().then((response) => {
    if (response === true) {
      return true;
    } else {
      localStorage.removeItem("user");
      return false;
    }
  });

  // trying to access a restricted page + not logged in
  // redirect to login page
  if ((authRequired && !loggedIn) || (authRequired && !loginValid)) {
    next("/login");
  } else {
    if (adminRequired && !admin) {
      next("/404");
    } else {
      next();
    }
  }
});

export default router;
