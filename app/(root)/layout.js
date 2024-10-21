import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "Evently",
  description: "Evently is a platform for event management",
  icons : {
    icon : "/public/assets/images/logo.svg"
  }
};

export default function RootLayout({ children }) {
  return (
      
      <div className="flex h-screen flex-col">
        <Header/>
      <main className="flex-1">{children}</main >
        <Footer/>
        </div>
    
  );
}
