import { MenuDisplay } from "@/components/menu/MenuDisplay";
import { menuData } from "@/lib/menu-data";

export default function MenuManagementPage() {
  return <MenuDisplay menuData={menuData} />;
}
