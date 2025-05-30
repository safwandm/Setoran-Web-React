"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { IconUpload } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { usetTitle } from "@/components/layout"
import { Pengguna, PostPenggunaDTO } from "@/lib/api-client"
import { LoadingOverlay } from "@/components/loading-overlay"
import ApiService, { BASE_PATH } from "@/lib/api-client/wrapper"
import { useCurrentUserStore } from "@/lib/stores/current-user"

export default function AccountPage() {
  const setTitle = usetTitle()
  const [isLoading, setIsLoading] = useState(false)
  const [pengguna, setPengguna] = useState<Pengguna>({})

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const currentUser = useCurrentUserStore((state) => state.currentUser)
  const refreshCurrentUser = useCurrentUserStore((state) => state.refresh)

  const apiService = ApiService.getInstance()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      apiService.penggunaApi.penggunaUpdateProfileImageIdPost({ file: file, id: pengguna.id! }).then(res => {
        toast.success("Profile picture updated!")
        setPengguna({ ... pengguna, idGambar: res })
        setIsLoading(false)
        refreshCurrentUser()
      })
    }
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    apiService.penggunaApi.penggunaPut({ postPenggunaDTO: { id: pengguna.id!,  nama: pengguna.nama, nomorTelepon: pengguna.nomorTelepon } })
      .then(res => {
        toast.success("Profile updated successfully")
        refreshCurrentUser()
        setIsLoading(false)
      })
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      toast.success("Password updated successfully")
    }, 1000)
  }

  const refresh = () => {
    setIsLoading(true)
    ApiService.getInstance().penggunaApi.penggunaCurrentPenggunaGet().then(res => {
      setPengguna(res)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setTitle("Account Setting")
    refresh()
  }, [])

  return (
        <div>
          <div className="flex flex-1 flex-col p-4 md:p-6">
            <Tabs defaultValue="profile" className="w-full">
              {/* <TabsList className="mb-4 gap-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList> */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile picture
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <CardContent className="space-y-6">
                      <LoadingOverlay loading={isLoading}>
                        <div className="flex items-center gap-4">
                              <img
                              src={pengguna.idGambar != undefined ? `${BASE_PATH}/storage/fetch/${pengguna.idGambar}` : `${BASE_PATH}/avatar?name=${pengguna.nama}`}
                              alt="Profile"
                              className="h-20 w-20 rounded-full object-cover"
                            />
                          <Label
                            htmlFor="avatar"
                            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                          >
                            <IconUpload className="h-4 w-4" />
                            Change Picture
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </Label>
                        </div>
                        <div className="grid gap-4 pt-5">
                          <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={pengguna.nama!}
                              onChange={(e) =>
                                setPengguna({ ... pengguna, nama: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={pengguna.email!}
                              onChange={(e) =>
                                setPengguna({ ...pengguna, email: e.target.value })
                              }
                              disabled={true}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={pengguna.nomorTelepon!}
                              onChange={(e) =>
                                setPengguna({ ...pengguna, nomorTelepon: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </LoadingOverlay>
                    </CardContent>
                    <CardFooter className="flex justify-end px-6 py-4">
                      <Button className="grid gap-10" type="submit" disabled={isLoading} >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordUpdate}>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwords.currentPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwords.newPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              newPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end px-6 py-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
  )
}
