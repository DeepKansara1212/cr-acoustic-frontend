import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, User as UserIcon, MapPin, LogOut, Trash2, Star } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useAddressStore } from "@/store/addressStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

const TABS = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "addresses", label: "Address Book", icon: MapPin },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) || "orders";
  const user = useAuthStore((s) => s.user)!;
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-1 font-heading text-3xl font-bold text-foreground">My Account</h1>
      <p className="mb-8 text-sm text-muted">
        {user.firstName} {user.lastName} · {user.email}
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground",
                tab === t.id && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <t.icon className="h-4 w-4" strokeWidth={1.5} />
              {t.label}
            </button>
          ))}
          <button
            onClick={logout}
            className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-error hover:bg-error/10"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Log out
          </button>
        </aside>

        <div>
          {tab === "orders" && <OrdersTab userId={user.id} />}
          {tab === "profile" && <ProfileTab />}
          {tab === "addresses" && <AddressesTab userId={user.id} />}
        </div>
      </div>
    </div>
  );
}

const STATUS_VARIANT = {
  confirmed: "success",
} as const;

function OrdersTab({ userId }: { userId: string }) {
  const allOrders = useOrderStore((s) => s.orders);
  const orders = useMemo(() => allOrders.filter((o) => o.userId === userId), [allOrders, userId]);

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-20 text-center">
        <p className="text-sm text-muted">You haven't placed any orders yet.</p>
        <Button asChild variant="link" className="mt-2">
          <Link to="/products">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">{order.orderNumber}</p>
              <p className="text-xs text-muted">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant={STATUS_VARIANT[order.orderStatus]} className="capitalize">
              {order.orderStatus}
            </Badge>
          </div>
          <div className="flex flex-col gap-1.5 py-4 text-sm">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-muted">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono text-sm font-semibold text-foreground">
              Total {formatPrice(order.total)}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link to={`/order-confirmation/${order.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const user = useAuthStore((s) => s.user)!;
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const push = useToastStore((s) => s.push);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    push("Profile updated", "success");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">First Name</label>
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Last Name</label>
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
        <Input value={user.email} disabled />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">Phone</label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+91 98765 43210"
        />
      </div>
      <Button type="submit" className="self-start">
        Save Changes
      </Button>
    </form>
  );
}

const emptyAddress = { label: "Home", street: "", city: "", state: "", postalCode: "", country: "India" };

function AddressesTab({ userId }: { userId: string }) {
  const allAddresses = useAddressStore((s) => s.addresses);
  const addresses = useMemo(
    () => allAddresses.filter((a) => a.userId === userId),
    [allAddresses, userId]
  );
  const addAddress = useAddressStore((s) => s.addAddress);
  const removeAddress = useAddressStore((s) => s.removeAddress);
  const setDefault = useAddressStore((s) => s.setDefault);
  const push = useToastStore((s) => s.push);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.postalCode) return;
    addAddress(userId, form);
    setForm(emptyAddress);
    setShowForm(false);
    push("Address added", "success");
  };

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-5"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{addr.label}</p>
              {addr.isDefault && (
                <Badge variant="warning">
                  <Star className="h-3 w-3 fill-current" /> Default
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">
              {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!addr.isDefault && (
              <Button variant="outline" size="sm" onClick={() => setDefault(userId, addr.id)}>
                Set Default
              </Button>
            )}
            <button
              onClick={() => removeAddress(addr.id)}
              aria-label="Remove address"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-error/10 hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-surface p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted">Label</label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted">Street Address</label>
            <Input required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">City</label>
            <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">State</label>
            <Input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Postal Code</label>
            <Input
              required
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Country</label>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit">Save Address</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" className="self-start" onClick={() => setShowForm(true)}>
          + Add New Address
        </Button>
      )}
    </div>
  );
}
