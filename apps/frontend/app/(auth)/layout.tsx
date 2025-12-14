import Footer from "@/components/Footer";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      <div className="flex min-h-screen justify-center items-center mt-10 bg-background text-foreground">
        {children}
      </div>
      <Footer />
    </>
  );
}
