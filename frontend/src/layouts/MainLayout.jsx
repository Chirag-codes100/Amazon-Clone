import Navbar from "../components/Navbar";

const MainLayout = ({
  children,
  search,
  setSearch,
  category,
  setCategory,
}) => {
  return (
    <div>
      <Navbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {children}
    </div>
  );
};

export default MainLayout;