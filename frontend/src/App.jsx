import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import CreatePost from "./pages/home/CreatePost.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import SearchPage from "./pages/search/SearchPage.jsx";


import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	const location = useLocation(); // Get the current route

	// Define routes that should NOT show the sidebar and right panel
	const noSidebarRoutes = ["/login" ,"/about","/signup"];

	// Check if the current route should NOT display the sidebar and right panel
	const hideSidebarAndRightPanel = noSidebarRoutes.includes(location.pathname);

	if (isLoading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className={hideSidebarAndRightPanel ? "w-full h-screen" : "flex max-w-6xl mx-auto"}>
			{/* Conditionally render the sidebar */}
			{authUser && !hideSidebarAndRightPanel && <Sidebar />}

			<Routes>
				<Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
				<Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
				<Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
				<Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
				<Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
				<Route path="/create-post" element={authUser ? <CreatePost /> : <Navigate to="/login" />} />
				<Route path="/about" element={authUser ? <AboutPage /> : <Navigate to="/login" />} />
				<Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
			</Routes>

			{/* Conditionally render the right panel */}
			{authUser && !hideSidebarAndRightPanel && <RightPanel />}
			
			<Toaster />
		</div>
	);
}

export default App;
