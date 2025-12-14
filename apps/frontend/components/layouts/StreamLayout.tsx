interface StreamLayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
  isStreaming: boolean;
}

export const StreamLayout: React.FC<StreamLayoutProps> = ({
  leftSidebar,
  mainContent,
  rightSidebar,
  isStreaming,
}) => {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4 h-[calc(100vh-120px)]">
        <div className="w-64 shrink-0">{!isStreaming && leftSidebar}</div>

        <div className="flex-1 min-w-0">{mainContent}</div>

        <div className="w-80 shrink-0">{rightSidebar}</div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        <div>{mainContent}</div>
        <div>{rightSidebar}</div>
        {!isStreaming && <div>{leftSidebar}</div>}
      </div>
    </>
  );
};
