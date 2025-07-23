const layout = ({ children }) => {
  return (
    <main className="bg-heroBackground">
      <div className="max-auto">
        <div>{children}</div>
      </div>
    </main>
  );
};

export default layout;
