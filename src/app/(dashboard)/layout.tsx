export default function DashboardRayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex">
        <div className="hidden bg-red-400 lg:w-1/4 lg:block">Sidebar</div>
        <main className="bg-blue-400 w-full lg:w-3/4">{children}</main>
      </div>
    );
  }
  