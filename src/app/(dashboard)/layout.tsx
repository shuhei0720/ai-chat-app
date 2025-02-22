export default function DashboardRayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex">
        <div className="bg-red-400 w-1/4">Sidebar</div>
        <main className="bg-blue-400 w-3/4">{children}</main>
      </div>
    );
  }
  