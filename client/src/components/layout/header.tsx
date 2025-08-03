import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";

export default function Header() {
  return (
    <header className="glass-effect backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-200">
                Aditya Janjanam
              </h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className="text-gray-600 hover:text-primary transition-colors duration-200 cursor-pointer font-medium hover:scale-105 transform">
                Home
              </span>
            </Link>
            <span className="text-gray-600 hover:text-primary transition-colors duration-200 cursor-pointer font-medium hover:scale-105 transform">
              About
            </span>
            <span className="text-gray-600 hover:text-primary transition-colors duration-200 cursor-pointer font-medium hover:scale-105 transform">
              Experience
            </span>
            <span className="text-gray-600 hover:text-primary transition-colors duration-200 cursor-pointer font-medium hover:scale-105 transform">
              Contact
            </span>
          </div>
          <Link href="/write">
            <Button className="gradient-bg text-white hover:opacity-90 hover:scale-105 transform transition-all duration-200 shadow-lg px-6 py-2 rounded-full">
              <PenTool className="w-4 h-4 mr-2" />
              Write Post
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
