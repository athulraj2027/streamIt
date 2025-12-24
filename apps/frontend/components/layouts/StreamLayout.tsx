interface StreamLayoutProps {
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
  children: React.ReactNode;
}

export const StreamLayout: React.FC<StreamLayoutProps> = ({
  leftSidebar,
  rightSidebar,
  children,
}) => {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4 mx-4">
        <div className="w-64 shrink-0 h-full">{leftSidebar}</div>
        <div className="flex-1 w-100 h-full ">{children}</div>
        <div className="w-80 shrink-0 h-full">{rightSidebar}</div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4 ">
        <div className="aspect-video m-1">{children}</div>
        <div>{rightSidebar}</div>
        <div>{leftSidebar}</div>
      </div>
    </>
  );
};
