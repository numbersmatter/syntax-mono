import { Form, Link, Outlet } from "react-router";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/layout";
import { ListOrderedIcon, Home, Inbox } from "lucide-react"


// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Food Pantry",
      url: "",

      items: [{
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Reservations",
        url: "/reservations",
        icon: ListOrderedIcon,
      }
      ]
    }
    // {
    //   title: "Food Pantry Activities",
    //   url: "home",
    //   items: [
    //     {
    //       title: "Events",
    //       url: "/events",
    //     },
    //     {
    //       title: "Semesters",
    //       url: "/semesters",
    //     }
    //     // {
    //     //   title: "Applications",
    //     //   url: "/applications",
    //     // },
    //     // {
    //     //   title: "Users",
    //     //   url: "/users",
    //     // }
    //   ],
    // },
  ],
}
export const loader = async ({ request }: Route.LoaderArgs) => {
  return {};
};


export default function MainLayout() {
  return (
    <>
      <>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <PageHeader />
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </>
    </>
  )
}
function PageHeader() {

  return (
    <header className="flex h-16 shrink-0 items-center px-4 border-b">
      <SidebarTrigger className=" -ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h3 className="text-lg font-semibold">
        Thomasville Food Pantry
      </h3>
      <Separator orientation="vertical" className="mr-2 h-4" />
    </header>
  )
}



function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>

      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                      <Link to={item.url}>

                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        {/* <LogOutButton /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
