const ITEMS = [
  "Smash Burger",
  "Ailes BBQ",
  "Frites maison",
  "Tenders",
  "Fish Burger",
  "Sauce Darka",
  "Onion Rings",
  "Hot Dog",
];

export function Marquee() {
  const list = [...ITEMS, ...ITEMS];
  return (
    <section className="border-y border-[color:var(--border)] py-6 overflow-hidden bg-[color:var(--surface)]">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {list.map((it, i) => (
          <span
            key={i}
            className="font-display text-3xl md:text-5xl text-text inline-flex items-center gap-12"
          >
            {it}
            <span className="text-[color:var(--accent)]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
