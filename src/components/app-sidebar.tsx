"use client"

import * as React from "react"
import {
  IconHome,
  IconFileText,
  IconUser,
  IconHelp,
  IconSettings,
  IconLogout,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading, signOut } = useAuth()

  const mainNavItems = [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Dietas",
      url: "/dietas",
      icon: IconFileText,
    },
    {
      title: "Perfil",
      url: "/perfil",
      icon: IconUser,
    },
  ]

  const secondaryNavItems = [
    {
      title: "Suporte",
      url: "/suporte",
      icon: IconHelp,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: IconSettings,
    },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">DietaBox</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {!loading && user ? (
          <>
            <NavMain items={mainNavItems} />
            <NavSecondary items={secondaryNavItems} className="mt-auto" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <IconUser className="size-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bem-vindo!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Faça login para acessar todas as funcionalidades
            </p>
          </div>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        {!loading && user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="p-4 border-t">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <IconUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">Conta ativa</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                >
                  <IconLogout className="w-4 h-4 mr-2" />
                  Sair da conta
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="p-4 border-t">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  onClick={() => {
                    // This would trigger the auth modal - you'd need to implement this
                    // For now, it's just a placeholder
                    console.log("Open auth modal")
                  }}
                >
                  Já possuo uma conta
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
