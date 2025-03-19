import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav"; // Adjust the import path if needed

import SubjectChoice from "./SubjectChoice"; // You'll need these imports to map the routes
import About from "./About";
import Legal from "./Legal";
import QuizSelection from "./quizselection";
import QuizChoice from "./QuizChoice";
import Quiz from "./Quiz";
import QuizResult from "./QuizResult";
import NewQuiz from "./NewQuiz";
import NewQuizResult from "./NewQuizResults";
import SignUp from "./SignUp";
import Account from "./Account";
import Badges from "./Badges";
import YourDetails from "./YourDetails";
import Leaderboard from "./Leaderboard";
import FeedbackForm from "./FeedbackForm";
import Admin from "./MyAdmin";

const routeConfig = [
  { path: "/", component: SubjectChoice, withBottomNav: true, exact: true },
  { path: "/about", component: About, withBottomNav: true, exact: true },
  { path: "/legal", component: Legal, withBottomNav: true, exact: true },
  {
    path: "/quizSelection/:subject",
    component: QuizSelection,
    withBottomNav: true,
  },
  { path: "/quizChoice/:section", component: QuizChoice, withBottomNav: true },
  { path: "/quiz/:section/:quizId", component: Quiz, withBottomNav: false },
  { path: "/newQuiz/:section", component: NewQuiz, withBottomNav: false },
  {
    path: "/quizResult/:section/:quizId",
    component: QuizResult,
    withBottomNav: true,
  },
  {
    path: "/newQuizResult/:section",
    component: NewQuizResult,
    withBottomNav: true,
  },
  { path: "/signup", component: SignUp, withBottomNav: true, exact: true },
  {
    path: "/moreinfo",
    component: YourDetails,
    withBottomNav: false,
    exact: true,
  },
  { path: "/account", component: Account, withBottomNav: true, exact: true },
  {
    path: "/contact",
    component: FeedbackForm,
    withBottomNav: true,
    exact: true,
  },
  { path: "/badges", component: Badges, withBottomNav: true, exact: true },
  {
    path: "/leaderboard",
    component: Leaderboard,
    withBottomNav: true,
    exact: true,
  },
  {
    path: "/myadmin",
    component: Admin,
    withBottomNav: true,
    exact: true,
  },
];

function MainContent({ setIsSidebarOpen }) {
  const location = useLocation();

  const doesPathMatch = (path, pathname) => {
    const pathSegments = path.split("/");
    const pathnameSegments = pathname.split("/");

    if (pathSegments.length !== pathnameSegments.length) return false;

    for (let i = 0; i < pathSegments.length; i++) {
      if (pathSegments[i].startsWith(":")) {
        continue; // This is a dynamic segment, skip
      }
      if (pathSegments[i] !== pathnameSegments[i]) {
        return false;
      }
    }
    return true;
  };

  const shouldShowBottomNav = routeConfig.some(
    (route) =>
      doesPathMatch(route.path, location.pathname) && route.withBottomNav
  );

  return (
    <>
      <Routes>
        {routeConfig.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Routes>
      {shouldShowBottomNav && (
        <BottomNav openSidebar={() => setIsSidebarOpen(true)} />
      )}
    </>
  );
}

export default MainContent;
