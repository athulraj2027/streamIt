export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50  bg-opacity-50 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};
