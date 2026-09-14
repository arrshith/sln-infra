import { Reveal } from "@/components/motion/primitives";
import type { ConnectivityCategory, ConnectivityItem } from "@/lib/content";

/**
 * What is near the community, grouped the way people actually ask: schools,
 * hospitals, the station, the office.
 *
 * Distances are printed only where SLN has measured and supplied them. An
 * entry without one still earns its place — knowing a school is nearby is
 * useful — but it is shown without a figure rather than with an invented one.
 */
const ORDER: ConnectivityCategory[] = [
  "schools",
  "hospitals",
  "retail",
  "transport",
  "highways",
  "business",
  "other",
];

const LABEL: Record<ConnectivityCategory, string> = {
  schools: "Schools",
  hospitals: "Hospitals",
  retail: "Shopping",
  transport: "Transport",
  highways: "Highways",
  business: "Work",
  other: "Nearby",
};

export function Connectivity({ items }: { items: ConnectivityItem[] }) {
  if (!items.length) return null;

  const groups = ORDER.map((category) => ({
    category,
    entries: items.filter((item) => item.category === category),
  })).filter((group) => group.entries.length > 0);

  return (
    <Reveal className="connectivity">
      {groups.map((group) => (
        <section key={group.category} data-stagger>
          <h3 className="label">{LABEL[group.category]}</h3>
          <ul>
            {group.entries.map((entry) => (
              <li key={`${group.category}-${entry.name}`}>
                <span className="connectivity-name">{entry.name}</span>
                {(entry.distanceKm !== undefined || entry.travelTime) && (
                  <span className="connectivity-measure">
                    {entry.distanceKm !== undefined && (
                      <span>{entry.distanceKm} km</span>
                    )}
                    {entry.travelTime && <span>{entry.travelTime}</span>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Reveal>
  );
}
