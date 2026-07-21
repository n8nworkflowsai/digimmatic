import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative antialiased overflow-x-hidden selection:bg-[#adc6ff]/30 selection:text-white">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-10 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-[#df7412]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <Header />

      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
}
