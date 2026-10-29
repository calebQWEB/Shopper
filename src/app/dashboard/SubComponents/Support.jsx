const faqs = [
  {
    q: "Where can I see my orders?",
    a: "Open the Orders tab. Each order shows its status, and you can click it to see the items and delivery address.",
  },
  {
    q: "I paid but my order isn't showing",
    a: "Orders appear once Paystack confirms your payment, which usually takes a few moments. Keep your payment reference in case you need to contact us.",
  },
  {
    q: "How are payments handled?",
    a: "Payments are processed securely by Paystack and charged in naira. We never see or store your card details.",
  },
  {
    q: "How do I update my details or password?",
    a: "Go to the Settings tab to change your name, email, phone number or password.",
  },
];

const Support = () => {
  return (
    <div>
      <h2 className="font-semibold">Help & support</h2>
      <p className="mt-1 text-sm text-slate-500">Answers to common questions.</p>
      <div className="card mt-4 divide-y divide-slate-200">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
              {q}
              <span className="text-slate-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Support;
