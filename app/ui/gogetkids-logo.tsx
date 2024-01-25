import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import { lusitana } from '@/app/ui/fonts';

export default function GoGetKidsLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <EscalatorWarningIcon className="h-12 w-12" />
      <p className="text-[44px]">GoGetKids</p>
    </div>
  );
}
