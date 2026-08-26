import Link from "next/link";
import { Bug, Globe, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-offwhite/10 text-offwhite pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="bg-red text-offwhite p-1.5 rounded-sm">
                <Bug size={32} />
              </div>
              <div className="flex flex-col">
                <span className="font-pixel text-2xl leading-none tracking-tighter text-red">A&B</span>
                <span className="text-xs font-bold tracking-widest text-offwhite/80 uppercase">Tournaments</span>
              </div>
            </Link>
            <p className="text-offwhite/70 max-w-sm mb-6">
              A&B Tournaments is a competition discovery and registration platform. Let's compete.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-offwhite/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors rounded-sm">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-offwhite/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors rounded-sm">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-offwhite/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors rounded-sm">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-red">Platform</h4>
            <ul className="space-y-3 text-offwhite/70">
              <li><Link href="/competitions" className="hover:text-red transition-colors">Competitions</Link></li>
              <li><Link href="/about" className="hover:text-red transition-colors">About Us</Link></li>
              <li><Link href="/gallery" className="hover:text-red transition-colors">Gallery</Link></li>
              <li><Link href="/partners" className="hover:text-red transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-red">Support</h4>
            <ul className="space-y-3 text-offwhite/70">
              <li><Link href="/contact" className="hover:text-red transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-red transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-red transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-red transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-offwhite/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-offwhite/40 text-sm font-medium uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} A&B Tournaments. All rights reserved.</p>
          <p>Ready to compete?</p>
        </div>
      </div>
    </footer>
  );
}
