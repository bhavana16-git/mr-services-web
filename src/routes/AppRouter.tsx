import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import PortalLayout from "@/components/layout/PortalLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Services from "@/pages/public/Services";
import WhyChooseUs from "@/pages/public/WhyChooseUs";
import Faq from "@/pages/public/Faq";
import Contact from "@/pages/public/Contact";
import Terms from "@/pages/public/Terms";
import Privacy from "@/pages/public/Privacy";
import NotFound from "@/pages/public/NotFound";
import BlogIndex from "@/pages/public/blog/BlogIndex";
import BlogPost from "@/pages/public/blog/BlogPost";
import SignUp from "@/pages/public/auth/SignUp";
import SignIn from "@/pages/public/auth/SignIn";
import ForgotPassword from "@/pages/public/auth/ForgotPassword";
import ResetPassword from "@/pages/public/auth/ResetPassword";

const Dashboard = lazy(() => import("@/pages/portal/Dashboard"));
const ServicePackages = lazy(() => import("@/pages/portal/ServicePackages"));
const MyRequests = lazy(() => import("@/pages/portal/MyRequests"));
const NewRequest = lazy(() => import("@/pages/portal/NewRequest"));
const RequestDetail = lazy(() => import("@/pages/portal/RequestDetail"));
const Documents = lazy(() => import("@/pages/portal/Documents"));
const Messages = lazy(() => import("@/pages/portal/Messages"));
const Profile = lazy(() => import("@/pages/portal/Profile"));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ContactSubmissions = lazy(() => import("@/pages/admin/ContactSubmissions"));
const Clients = lazy(() => import("@/pages/admin/Clients"));
const ClientDetail = lazy(() => import("@/pages/admin/ClientDetail"));
const AdminRequests = lazy(() => import("@/pages/admin/AdminRequests"));
const AdminRequestDetail = lazy(() => import("@/pages/admin/AdminRequestDetail"));
const AdminDocuments = lazy(() => import("@/pages/admin/AdminDocuments"));
const AdminMessages = lazy(() => import("@/pages/admin/AdminMessages"));
const AdminPackages = lazy(() => import("@/pages/admin/AdminPackages"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/why-choose-us" element={<WhyChooseUs />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute role="client" />}>
              <Route element={<PortalLayout />}>
                <Route path="/portal/dashboard" element={<Dashboard />} />
                <Route path="/portal/packages" element={<ServicePackages />} />
                <Route path="/portal/requests" element={<MyRequests />} />
                <Route path="/portal/requests/new" element={<NewRequest />} />
                <Route path="/portal/requests/:id" element={<RequestDetail />} />
                <Route path="/portal/documents" element={<Documents />} />
                <Route path="/portal/messages" element={<Messages />} />
                <Route path="/portal/profile" element={<Profile />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/contact-submissions" element={<ContactSubmissions />} />
                <Route path="/admin/clients" element={<Clients />} />
                <Route path="/admin/clients/:id" element={<ClientDetail />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/requests/:id" element={<AdminRequestDetail />} />
                <Route path="/admin/documents" element={<AdminDocuments />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/packages" element={<AdminPackages />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}







