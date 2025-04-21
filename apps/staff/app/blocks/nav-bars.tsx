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
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import {
  InboxIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { SignedIn, UserButton } from '@clerk/react-router'




export function MainNavBar() {
  return (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
      
        {/* <TeamSelector /> */}
        <UserInfo />
      </NavbarSection>
    </Navbar>

  )
}

function UserInfo(){
  return <SignedIn>
    <UserButton />
  </SignedIn>
}



function TeamSelector() {
  return <Dropdown>
    <DropdownButton as={NavbarItem}>
      <Avatar src="/profile-photo.jpg" square />
    </DropdownButton>
    <DropdownMenu className="min-w-64" anchor="bottom end">
      <DropdownItem href="/my-profile">
        <UserIcon />
        <DropdownLabel>My profile</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/privacy-policy">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/share-feedback">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/logout">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
}
