import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { lusitana } from '@/app/ui/fonts';

export default function SchoolAdminLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <AdminPanelSettingsIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[36px]">School Admin</p>
    </div>
  );
}
