import { Form, Link, Outlet } from "react-router";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";


// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "",
      items: [
      ],
    },
    {
      title: "Food Pantry Activities",
      url: "home",
      items: [
        {
          title: "Events",
          url: "/events",
        },
        {
          title: "Semesters",
          url: "/semesters",
        }
        // {
        //   title: "Applications",
        //   url: "/applications",
        // },
        // {
        //   title: "Users",
        //   url: "/users",
        // }
      ],
    },
  ],
}



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
        Food Pantry Staff
      </h3>
      <Separator orientation="vertical" className="mr-2 h-4" />
    </header>
  )
}

function LogOutButton() {
  return (
    <Form method="POST" action={"/logout"}>
      <Button variant={"destructive"} type="submit">Sign Out</Button>
    </Form>
  )
}


function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h4>
          Staff Pantry
        </h4>
      </SidebarHeader>
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
                      <Link to={item.url}>{item.title}</Link>
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
        <LogOutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
