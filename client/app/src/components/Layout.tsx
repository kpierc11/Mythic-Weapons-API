import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle inline"
      />

      <div className="drawer-content">
        <Navbar />

        <main className="p-4">
          <Outlet />
        </main>
      </div>

      <Sidebar />
    </div>
  );
}
