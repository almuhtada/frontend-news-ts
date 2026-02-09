interface Props {
  title: string;
  subtitle: string;
}

const DashboardHeader: React.FC<Props> = ({ title, subtitle }) => (
  <header>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
  </header>
);

export default DashboardHeader;
