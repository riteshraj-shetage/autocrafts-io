import type { PropsWithChildren } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type LayoutProps = PropsWithChildren<{
  username: string;
  starsCount?: string | number;
  onSearch?: (username: string) => void;
  onReset?: () => void;
}>;

export default function Layout({ 
  children, 
  username, 
  starsCount, 
  onSearch, 
  onReset,  
}: LayoutProps) {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Navbar 
        username={username} 
        starsCount={starsCount} 
        onSearch={onSearch}
        onReset={onReset}
      />
      
      <main className="mx-auto w-full max-w-4xl flex-1 flex flex-col px-4 sm:px-6 py-6 md:py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}