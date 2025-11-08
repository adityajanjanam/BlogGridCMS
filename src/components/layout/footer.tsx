import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      <div className="relative glass-effect border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                MyBlog
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                A modern, minimalist blog platform for sharing thoughts, experiences, and insights with the world. 
                Join our community of writers and readers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-300 hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-6">Categories</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">Technology</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">Design</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">Productivity</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">Lifestyle</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-6">About</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">About Me</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">Contact</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors duration-200 hover:translate-x-1 transform inline-block">RSS Feed</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2025 MyBlog. Made with ❤️ for the community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
