const Loader = () => {
  return (
    <>
      <div
        id="loader"
        className="flex justify-center items-center min-h-screen"
      >
        <div className="border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin w-16 h-16">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Loader;
