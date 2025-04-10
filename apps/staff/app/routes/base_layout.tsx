import { SidebarLayout } from '~/components/sidebar-layout'
import { Outlet } from 'react-router'
import { MainNavBar } from '~/blocks/nav-bars'
import { MainSideBar } from '~/blocks/side-bars'

export default function MainLayout() {
  return (
    <SidebarLayout
      navbar={
        <MainNavBar />
      }
      sidebar={
        <MainSideBar />
      }
    >
      <Outlet />
    </SidebarLayout>
  )
}