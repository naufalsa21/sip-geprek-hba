import Sidebar from "../components/SidebarKepalaToko";
import Header from "../components/Header";

const MainLayoutKepalaToko = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-20 z-40">
        <Sidebar />
      </div>

      {/* Konten */}
      <div className="flex flex-col flex-1 pl-20">
        {/* Header */}
        <div className="fixed top-0 left-20 right-0 z-50">
          <Header />
        </div>

        {/* Main Content */}
        <main className="p-6 space-y-6 mt-15">{children}</main>
      </div>
    </div>
  );
};

export default MainLayoutKepalaToko;
