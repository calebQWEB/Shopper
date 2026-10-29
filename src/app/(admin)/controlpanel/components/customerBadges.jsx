import { Pill } from "./ui";

const levelTones = { bronze: "amber", silver: "gray", gold: "amber", platinum: "blue" };

export const LEVELS = ["bronze", "silver", "gold", "platinum"];

export const LevelPill = ({ level }) => <Pill tone={levelTones[level] ?? "gray"}>{level}</Pill>;

export const CustomerStatusPill = ({ status }) => (
  <Pill tone={status === "active" ? "green" : status === "banned" ? "red" : "gray"}>{status}</Pill>
);

export const Avatar = ({ name = "", size = "h-9 w-9 text-xs" }) => (
  <span className={`grid shrink-0 place-items-center rounded-full bg-headline font-bold text-white ${size}`}>
    {name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("")}
  </span>
);
