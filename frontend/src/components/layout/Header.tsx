import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-center sm:justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold tracking-tight text-[#752b26] transition-opacity hover:opacity-80"
          >
            LearnIA
          </Link>

          <div className="hidden sm:block mx-4 h-6 w-[1px] bg-stone-300 sm:mx-6" aria-hidden="true" />
        </div>

        <nav 
          aria-label="Navegación principal" 
          className="hidden sm:block absolute left-1/2 -translate-x-1/2"
        >
          <ul className="flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-base font-semibold text-[#752b26] transition-all duration-300 ease-out hover:scale-105 hover:bg-[#fde9e7] hover:text-[#752b26] hover:shadow-sm hover:ring-1 hover:ring-[#F39E92] active:scale-95"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
        </div>

      </div>
    </header>
  );
}