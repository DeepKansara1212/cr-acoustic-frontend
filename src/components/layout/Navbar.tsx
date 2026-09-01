import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, AudioWaveform, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

const links = [
  { to: "/products", label: "Shop" },
  { to: "/products?category=amplifier", label: "Amplifiers" },
  { to: "/products?category=speaker", label: "Speakers" },
  { to: "/products?category=microphone", label: "Microphones" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <AudioWaveform className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">CR Acoustic</span>
        </Link>

        {searchOpen ? (
          <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2 px-4 sm:px-8">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search amplifiers, speakers, microphones..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium text-muted transition-colors hover:text-foreground",
                    isActive && "text-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1">
          {!searchOpen && (
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground sm:flex"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
          )}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground sm:flex"
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="relative hidden sm:block" ref={accountMenuRef}>
            <button
              aria-label="Account"
              onClick={() => (user ? setAccountMenuOpen((v) => !v) : navigate("/login"))}
              className="flex h-10 w-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <User className="h-4.5 w-4.5" />
            </button>
            {accountMenuOpen && user && (
              <div className="absolute right-0 top-12 w-52 rounded-lg border border-border bg-surface p-1.5 shadow-[0_16px_40px_rgba(20,22,26,0.14)]">
                <p className="truncate px-3 py-2 text-xs text-muted">Signed in as {user.email}</p>
                <Link
                  to="/account"
                  onClick={() => setAccountMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface-elevated"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setAccountMenuOpen(false);
                    navigate("/");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-error hover:bg-surface-elevated"
                >
                  <LogOut className="h-3.5 w-3.5" /> Log out
                </button>
              </div>
            )}
          </div>

          <button
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-foreground lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 lg:hidden">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
          >
            Wishlist
          </NavLink>
          <NavLink
            to={user ? "/account" : "/login"}
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
          >
            {user ? "My Account" : "Sign In"}
          </NavLink>
        </nav>
      )}
    </header>
  );
}
