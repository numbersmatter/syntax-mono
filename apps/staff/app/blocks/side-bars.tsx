import { Avatar } from '~/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '~/components/dropdown'
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer
} from '~/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '~/components/sidebar'
import { SidebarLayout } from '~/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { SignedIn, UserButton } from '@clerk/react-router'


export function MainSideBar() {

  return (
    <Sidebar>
      <SidebarHeader>
        {/* <TeamSelector /> */}
        {/* <SidebarSection className="max-lg:hidden">
          <SidebarItem href="/search">
            <MagnifyingGlassIcon />
            <SidebarLabel>Search</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/inbox">
            <InboxIcon />
            <SidebarLabel>Inbox</SidebarLabel>
          </SidebarItem>
        </SidebarSection> */}
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/">
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/events">
            <Square2StackIcon />
            <SidebarLabel>Events</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/orders">
            <TicketIcon />
            <SidebarLabel>Orders</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/settings">
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
          {/* <SidebarItem href="/broadcasts">
            <MegaphoneIcon />
            <SidebarLabel>Announcements</SidebarLabel>
          </SidebarItem> */}
        </SidebarSection>
        <SidebarSection className="max-lg:hidden">
          {/* <SidebarHeading>Upcoming Events</SidebarHeading>
          <SidebarItem href="/events/1">Bear Hug: Live in Concert</SidebarItem>
          <SidebarItem href="/events/2">Viking People</SidebarItem>
          <SidebarItem href="/events/3">Six Fingers — DJ Set</SidebarItem>
          <SidebarItem href="/events/4">We All Look The Same</SidebarItem> */}
        </SidebarSection>
        <SidebarSpacer />
        {/* <SidebarSection>
          <SidebarItem href="/support">
            <QuestionMarkCircleIcon />
            <SidebarLabel>Support</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/changelog">
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem>
        </SidebarSection> */}
      </SidebarBody>
      <SidebarFooter className="bg-slate-300  max-lg:hidden ">
        <SignedIn>
          <UserButton showName  />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>

  )
}

function TeamSelector() {
  return <Dropdown>
    <DropdownButton as={SidebarItem} className="lg:mb-2.5">
      <Avatar src="/tailwind-logo.svg" />
      <SidebarLabel>Tailwind Labs</SidebarLabel>
      <ChevronDownIcon />
    </DropdownButton>
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/teams/1/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/1">
        <Avatar slot="icon" src="/tailwind-logo.svg" />
        <DropdownLabel>Tailwind Labs</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/teams/2">
        <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
        <DropdownLabel>Workcation</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>New team&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
}
