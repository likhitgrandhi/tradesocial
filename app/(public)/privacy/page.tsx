import { HardHat } from "lucide-react"

export default function PrivacyPage() {
  return <ComingSoon title="Privacy Policy" description="Our privacy policy will be published here." />
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-surface-raised border border-border-default flex items-center justify-center">
        <HardHat className="w-5 h-5 text-content-muted" />
      </div>
      <div className="space-y-1">
        <h1 className="text-content-primary" style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-medium)" }}>
          {title}
        </h1>
        <p className="text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
          {description}
        </p>
        <p className="text-content-disabled" style={{ fontSize: "var(--font-size-13)" }}>
          Being built
        </p>
      </div>
    </div>
  )
}
