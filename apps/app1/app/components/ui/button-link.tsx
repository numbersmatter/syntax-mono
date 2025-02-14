import { Link } from "react-router";
import { cn } from "~/lib/utils";



export function ButtonLink({ to, children }: { to: string, children: React.ReactNode }) {

  return (
    <Link
      to={to}
      className={cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        , "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {children}

    </Link>
  )
}