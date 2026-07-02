"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  GraduationCap,
  LogOut,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  Search,
  CalendarCheck,
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { logout } from "@/lib/auth/actions";
import { SITE_NAME } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import type { UserRole } from "@/types/database";

interface NavbarClientProps {
  isLoggedIn: boolean;
  role: UserRole | null;
  displayName: string | null;
  avatarUrl: string | null;
  email: string | null;
}

// ─── Role-specific navigation links ─────────────────────────

const teacherLinks = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/profile", label: "My Portfolio", icon: FileText },
  { href: "/jobs", label: "Browse Jobs", icon: Search },
  { href: "/teacher/interviews", label: "Interviews", icon: CalendarCheck },
];

const instituteLinks = [
  { href: "/institute/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/institute/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/institute/jobs/new", label: "Post a Job", icon: Plus },
  { href: "/teachers", label: "Find Teachers", icon: Search },
  { href: "/institute/interviews", label: "Interviews", icon: CalendarCheck },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/verifications", label: "Verifications", icon: Shield },
];

const publicLinks = [
  { href: "/teachers", label: "Find Teachers", icon: Search },
  { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
  { href: "/about", label: "About", icon: Building2 },
];

function getNavLinks(role: UserRole | null, isLoggedIn: boolean) {
  if (!isLoggedIn) return publicLinks;
  switch (role) {
    case "teacher":
      return teacherLinks;
    case "institute":
      return instituteLinks;
    case "admin":
      return adminLinks;
    default:
      return publicLinks;
  }
}

export default function NavbarClient({
  isLoggedIn,
  role,
  displayName,
  avatarUrl,
  email,
}: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navLinks = getNavLinks(role, isLoggedIn);

  const roleLabel =
    role === "teacher"
      ? "Teacher"
      : role === "institute"
        ? "Institute"
        : role === "admin"
          ? "Admin"
          : "";

  const roleBadgeColor =
    role === "teacher"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : role === "institute"
        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
        : role === "admin"
          ? "bg-red-500/10 text-red-400 border-red-500/30"
          : "";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-400 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                {/* Avatar */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || ""}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-700"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold">
                    {getInitials(displayName || email || "U")}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-white leading-tight">
                    {displayName}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium border",
                      roleBadgeColor
                    )}
                  >
                    {roleLabel}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-500 transition-transform",
                    profileMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/20 z-50 py-2">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-sm font-medium text-white">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {email}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      {role === "teacher" && (
                        <Link
                          href="/teacher/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          My Portfolio
                        </Link>
                      )}
                      {role === "institute" && (
                        <Link
                          href="/institute/jobs/new"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Plus className="h-4 w-4" />
                          Post a Job
                        </Link>
                      )}
                      <Link
                        href={`/${role}/dashboard`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-800 pt-1">
                      <form action={logout}>
                        <button
                          type="submit"
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" href="/auth/login">
                Log In
              </Button>
              <Button variant="primary" size="sm" href="/auth/signup">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-slate-400 hover:text-white transition-colors p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            {/* User info (mobile) */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-slate-800/50">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || ""}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm font-bold">
                    {getInitials(displayName || email || "U")}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {displayName}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium border",
                      roleBadgeColor
                    )}
                  >
                    {roleLabel}
                  </span>
                </div>
              </div>
            )}

            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-2 border-t border-slate-800/50 mt-2">
              {isLoggedIn ? (
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              ) : (
                <>
                  <Button variant="ghost" size="md" href="/auth/login">
                    Log In
                  </Button>
                  <Button variant="primary" size="md" href="/auth/signup">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
