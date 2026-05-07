import { Suspense } from "react";
import { MenuView } from "@/components/menu-view";

export const metadata = {
  title: "Menu",
  description: "La carte complète La Darka : burgers, sandwichs, salades et bien plus.",
};

export default function MenuPage() {
  return (
    <Suspense>
      <MenuView />
    </Suspense>
  );
}
