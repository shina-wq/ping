import { useState } from "react";
import {Bell, ChevronDown, Lock, Palette, UserRound} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { usePageHeader } from "@/components/page-header-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import { getInitials } from "@/lib/format";
import {cn} from "@/lib/utils";
import CourseAnnouncements from "./courses/CourseAnnouncements";

// section wrapper
type SectionProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

function Section({icon, title, children}: SectionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      {/* Section header */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-3">
        <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

// Row variants
type FieldRowProps = {
  label: string;
  children: React.ReactNode;
};

function FieldRow({label, children}: FieldRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <Label className="shrink-0 text-sm font-normal text-foreground">{label}</Label>
      <div className="w-56 shrink-0">{children}</div>
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
};

function ToggleRow({label, checked, onCheckedChange}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange}/>
    </div>
  );
}

type ActionRowProps = {
  label: string;
  actionLabel: string;
  onClick?: () => void;
  destructive?: boolean;
};

function ActionRow({label, actionLabel, onClick, destructive}: ActionRowProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-foreground">{label}</span>
      <Button
        size="sm"
        variant={destructive ? "destructive" : "outline"}
        onClick={onClick}
        className="h-8"
      >
        {actionLabel}
      </Button>
    </div>
  );
}

// Read-only input
function ReadOnlyInput({value}: {value: string}) {
  return (
    <Input
      readOnly
      value={value}
      className="h-8 cursor-default bg-muted/50 text-right text-sm text-muted-foreground focus-visible:ring-0 focus-visible:border-input"
    />
  );
}

// Select
type SelectFieldProps = {
  value: string;
  onChange: (v: string) => void;
  options: {value: string; label: string} [];
};

function SelectField({value, onChange, options}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 w-full appearance-none rounded-md border border-input bg-background pr-8 pl-3 text-sm", "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring", "transition-[color, box-shadow]"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"/>
    </div>
  );
}

// Page
export default function Settings() {
  usePageHeader({
    title: "Settings",
    description: "Manage your account, notifications, and preferences.",
  });

  const {user} = useAuth();

  // Notification toggles
  const [notifs, setNotifs] = useState({
    assignmentReminders: true,
    gradeAlerts: true,
    CourseAnnouncements: true,
    weeklyDigest: false,
  });

  const setNotif = (key:keyof typeof notifs) => (v: boolean) =>
    setNotifs((prev) => ({...prev, [key]: v }));

  // Appearance
  const [theme, setTheme] = useState("Light");
  const [compactView, setCompactView] = useState(false);

  // Privacy
  const [twoFactor, setTwoFactor] = useState(false);
  const [shareProgress, setShareProgress] = useState(true);

  // Year of study
  const [yearOfStudy, setYearOfStudy] = useState("2nd Year");

  const initials = user ? getInitials(user.name) : "";

  return (
    <div className="max-w-2xl space-y-5 pb-24">
      {/* profile card */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-xs">
        <Avatar className="size-14">
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-0.5">
          <p className="font-semibold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role} &bull; Fall Semester 2024</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Change photo
        </Button>
      </div>

      {/* Account */}
      <Section icon={<UserRound />} title="Account">
        <FieldRow label="Full Name">
          <ReadOnlyInput value={user?.name ?? ""} />
        </FieldRow>
        <FieldRow label="Email Address">
          <ReadOnlyInput value={user?.email ?? ""} />
        </FieldRow>
        <FieldRow label="Student ID">
          <ReadOnlyInput value="STU-20240183" />
        </FieldRow>
        <FieldRow label="Year of Study">
          <ReadOnlyInput value="3rd Year"/>
        </FieldRow>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell />} title="Notifications">
        <ToggleRow
          label="Assignments due reminders"
          checked={notifs.assignmentReminders}
          onCheckedChange={setNotif("assignmentReminders")}
        />
        <ToggleRow
          label="Grades posted alerts"
          checked={notifs.gradeAlerts}
          onCheckedChange={setNotif("gradeAlerts")}
        />
        <ToggleRow
          label="Course announcements"
          checked={notifs.CourseAnnouncements}
          onCheckedChange={setNotif("CourseAnnouncements")}
        />
        <ToggleRow
          label="Weekly progress digest"
          checked={notifs.weeklyDigest}
          onCheckedChange={setNotif("weeklyDigest")}
        />
      </Section>

      {/* Appearance */}
      <Section icon={<Palette />} title="Appearance">
        <FieldRow label="Theme">
          <SelectField
            value={theme}
            onChange={setTheme}
            options={[
              {value: "Light", label: "Light"},
              {value: "Dark", label: "Dark"},
              {value: "System", label: "System"},
            ]}
          />
        </FieldRow>
        <ToggleRow
          label="Compact view"
          checked={compactView}
          onCheckedChange={setCompactView}
        />
      </Section>

      {/* Privacy & Security */}
      <Section icon={<Lock />} title="Privacy & Security">
          <ActionRow label="Change password" actionLabel="Update"/>
          <ToggleRow
            label="Two-factor authentication"
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          />
          <ToggleRow
            label="Share progress with advisor"
            checked={shareProgress}
            onCheckedChange={setShareProgress}
          />
      </Section>

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-end border-t border-border bg-background/95 px-8 py-3 backdrop:-blur-sm">
        <Button className="px-6">Save Changes</Button>
      </div>
    </div>
  )
}

