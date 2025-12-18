interface StreamLayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export const StreamLayout: React.FC<StreamLayoutProps> = ({
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4 h-[calc(100vh-120px)] mx-4">
        <div className="w-64 shrink-0 h-full">{leftSidebar}</div>
        <div className="flex-1 w-full h-full ">{mainContent}</div>
        <div className="w-80 shrink-0 h-full">{rightSidebar}</div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4 ">
        <div className="aspect-video m-1">{mainContent}</div>
        <div>{rightSidebar}</div>
        <div>{leftSidebar}</div>
      </div>
    </>
  );
};
