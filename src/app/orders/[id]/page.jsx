import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OrderStatus, { orderRef } from "@/components/ui/OrderStatus";
import { prisma } from "@/libs/prisma";
import { formatDate, formatNaira, formatPrice } from "@/libs/format";

export const metadata = { title: "Order details" };

const page = async ({ params }) => {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=/orders/${id}`);

  const orderId = Number.parseInt(id, 10);
  if (Number.isNaN(orderId)) notFound();

  // Customers can only open their own orders; admins can open any
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }),
    },
    include: { items: true },
  });
  if (!order) notFound();

  const address = order.shippingAddress ?? {};
  const addressLine = [address.street, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="container-page py-6 sm:py-8">
      <Link href="/dashboard?tab=orders" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-headline">
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Order {orderRef(order.reference)}</h1>
        <OrderStatus status={order.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card">
          <h2 className="border-b border-slate-200 px-4 py-3 font-semibold sm:px-6">Items</h2>
          <ul className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                  <Image src={item.productPicture} alt={item.productName} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">{item.productName}</p>
                  <p className="text-xs capitalize text-slate-500">
                    {item.category} · Qty {item.productQuantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatPrice(item.productPrice * item.productQuantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="grid gap-4">
          <div className="card p-5">
            <h2 className="font-semibold">Payment</h2>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Total paid</dt>
                <dd className="font-bold">{formatNaira(order.totalPrice)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Reference</dt>
                <dd className="truncate font-mono text-xs">{order.reference}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <MapPin size={16} />
              Delivery
            </h2>
            <div className="mt-3 text-sm text-slate-600">
              {address.fullName && <p className="font-semibold text-headline">{address.fullName}</p>}
              <p>{addressLine || "No address recorded"}</p>
              {address.landmark && <p>Landmark: {address.landmark}</p>}
              {(address.phone || address.email) && (
                <p className="mt-1 text-slate-500">
                  {[address.phone, address.email].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default page;
